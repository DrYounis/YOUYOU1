'use client';

import { useState, useEffect } from 'react';
import { getAllOrders, updateOrder, exportOrdersAsJSON } from '../../../lib/supabaseOrders';

const ADMIN_PASSWORD = 'younis2024'; // Change this to your desired password

export default function AdminOrdersPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, paid
    const [updatingId, setUpdatingId] = useState(null);

    // Load orders
    const loadOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const fetchedOrders = await getAllOrders();
            setOrders(fetchedOrders);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError('Failed to load orders. Check Firebase configuration.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authenticated) {
            loadOrders();
        }
    }, [authenticated]);

    // Handle password submission
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setAuthenticated(true);
            setPasswordError('');
        } else {
            setPasswordError('Incorrect password');
        }
    };

    // Mark payment as confirmed
    const markAsPaid = async (orderId) => {
        setUpdatingId(orderId);
        try {
            await updateOrder(orderId, {
                status: 'paid',
                paymentConfirmedAt: new Date().toISOString(),
            });
            // Update local state
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, status: 'paid', paymentConfirmedAt: new Date().toISOString() }
                        : order
                )
            );
        } catch (err) {
            console.error('Error updating order:', err);
            alert('Failed to update order');
        } finally {
            setUpdatingId(null);
        }
    };

    // Update delivery status
    const updateDeliveryStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await updateOrder(orderId, {
                deliveryStatus: newStatus,
                deliveryUpdatedAt: new Date().toISOString(),
            });
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, deliveryStatus: newStatus, deliveryUpdatedAt: new Date().toISOString() }
                        : order
                )
            );
        } catch (err) {
            console.error('Error updating delivery:', err);
            alert('Failed to update delivery status');
        } finally {
            setUpdatingId(null);
        }
    };

    // Export orders as JSON
    const handleExport = async () => {
        try {
            const json = await exportOrdersAsJSON();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `younis-store-orders-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to export orders');
        }
    };

    // Export as CSV
    const handleExportCSV = async () => {
        try {
            const ordersData = await exportOrdersAsJSON();
            const orders = JSON.parse(ordersData);

            const headers = [
                'Order ID', 'Date', 'Customer Name', 'Phone', 'Email',
                'Delivery Type', 'School', 'Address', 'City',
                'Payment Method', 'Status', 'Price (SAR)'
            ];

            const rows = orders.map(order => [
                order.id,
                order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : order.createdAt || 'N/A',
                order.customerName || '',
                order.phone || '',
                order.email || '',
                order.deliveryType || '',
                order.schoolName || '',
                order.homeAddress || '',
                order.homeCity || '',
                order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Apple Pay',
                order.status || 'pending',
                order.price || 50,
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `younis-store-orders-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to export CSV');
        }
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') return order.status === 'pending';
        if (filter === 'paid') return order.status === 'paid';
        return true;
    });

    // Format date
    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        if (dateValue?.toDate) return dateValue.toDate().toLocaleString();
        return new Date(dateValue).toLocaleString();
    };

    // Password screen
    if (!authenticated) {
        return (
            <div style={styles.page}>
                <div style={styles.loginCard}>
                    <h1 style={styles.loginTitle}>🔐 Admin Access</h1>
                    <p style={styles.loginSubtitle}>Enter password to view orders</p>
                    <form onSubmit={handlePasswordSubmit} style={styles.loginForm}>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Enter admin password"
                            style={styles.passwordInput}
                        />
                        {passwordError && <p style={styles.errorText}>{passwordError}</p>}
                        <button type="submit" style={styles.loginBtn}>
                            Access Orders
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>📦 Younis Store - Orders</h1>
                    <div style={styles.headerActions}>
                        <button onClick={loadOrders} style={styles.btnRefresh} disabled={loading}>
                            {loading ? '⏳ Loading...' : '🔄 Refresh'}
                        </button>
                        <button onClick={handleExport} style={styles.btnExport}>
                            📥 Export JSON
                        </button>
                        <button onClick={handleExportCSV} style={styles.btnExport}>
                            📊 Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <span style={styles.statNumber}>{orders.length}</span>
                        <span style={styles.statLabel}>Total Orders</span>
                    </div>
                    <div style={{ ...styles.statCard, backgroundColor: '#FFF3E0' }}>
                        <span style={{ ...styles.statNumber, color: '#FF9800' }}>
                            {orders.filter(o => o.status === 'pending').length}
                        </span>
                        <span style={styles.statLabel}>Pending Payment</span>
                    </div>
                    <div style={{ ...styles.statCard, backgroundColor: '#E8F5E9' }}>
                        <span style={{ ...styles.statNumber, color: '#4CAF50' }}>
                            {orders.filter(o => o.status === 'paid').length}
                        </span>
                        <span style={styles.statLabel}>Paid</span>
                    </div>
                    <div style={{ ...styles.statCard, backgroundColor: '#E3F2FD' }}>
                        <span style={{ ...styles.statNumber, color: '#2196F3' }}>
                            {orders.reduce((sum, o) => sum + (o.price || 50), 0)} SAR
                        </span>
                        <span style={styles.statLabel}>Total Revenue</span>
                    </div>
                </div>

                {/* Filter */}
                <div style={styles.filterRow}>
                    <button
                        onClick={() => setFilter('all')}
                        style={{
                            ...styles.filterBtn,
                            backgroundColor: filter === 'all' ? '#FF6B6B' : '#f5f5f5',
                            color: filter === 'all' ? '#fff' : '#666',
                        }}
                    >
                        All ({orders.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        style={{
                            ...styles.filterBtn,
                            backgroundColor: filter === 'pending' ? '#FF9800' : '#f5f5f5',
                            color: filter === 'pending' ? '#fff' : '#666',
                        }}
                    >
                        Pending ({orders.filter(o => o.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('paid')}
                        style={{
                            ...styles.filterBtn,
                            backgroundColor: filter === 'paid' ? '#4CAF50' : '#f5f5f5',
                            color: filter === 'paid' ? '#fff' : '#666',
                        }}
                    >
                        Paid ({orders.filter(o => o.status === 'paid').length})
                    </button>
                </div>

                {/* Error */}
                {error && <p style={styles.errorText}>{error}</p>}

                {/* Orders List */}
                {loading && orders.length === 0 ? (
                    <div style={styles.loading}>
                        <div style={styles.spinner}></div>
                        <p>Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={{ fontSize: '4rem' }}>📭</span>
                        <p>No orders found</p>
                    </div>
                ) : (
                    <div style={styles.ordersList}>
                        {filteredOrders.map(order => (
                            <div key={order.id} style={styles.orderCard}>
                                {/* Order Header */}
                                <div style={styles.orderHeader}>
                                    <div>
                                        <h3 style={styles.orderId}>Order #{order.id.slice(0, 8)}</h3>
                                        <p style={styles.orderDate}>{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div style={styles.statusBadges}>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: order.status === 'paid' ? '#4CAF50' : '#FF9800',
                                        }}>
                                            {order.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                                        </span>
                                        {order.deliveryStatus && (
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: '#2196F3',
                                            }}>
                                                {order.deliveryStatus}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div style={styles.orderSection}>
                                    <h4 style={styles.sectionTitle}>👤 Customer</h4>
                                    <div style={styles.infoGrid}>
                                        <div><strong>Name:</strong> {order.customerName}</div>
                                        <div><strong>Phone:</strong> {order.phone}</div>
                                        <div><strong>Email:</strong> {order.email}</div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div style={styles.orderSection}>
                                    <h4 style={styles.sectionTitle}>🚚 Delivery</h4>
                                    <div style={styles.infoGrid}>
                                        <div>
                                            <strong>Type:</strong>{' '}
                                            {order.deliveryType === 'school' ? '🏫 School Pickup' : '🏠 Home Delivery'}
                                        </div>
                                        {order.schoolName && <div><strong>School:</strong> {order.schoolName}</div>}
                                        {order.homeAddress && <div><strong>Address:</strong> {order.homeAddress}</div>}
                                        {order.homeCity && <div><strong>City:</strong> {order.homeCity}</div>}
                                        {order.homePhone && <div><strong>Delivery Phone:</strong> {order.homePhone}</div>}
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div style={styles.orderSection}>
                                    <h4 style={styles.sectionTitle}>💳 Payment</h4>
                                    <div style={styles.infoGrid}>
                                        <div>
                                            <strong>Method:</strong>{' '}
                                            {order.paymentMethod === 'bank_transfer' ? '🏦 Bank Transfer' : '🍎 Apple Pay'}
                                        </div>
                                        <div><strong>Amount:</strong> {order.price || 50} SAR</div>
                                    </div>
                                </div>

                                {/* Image */}
                                {order.imageUrl && (
                                    <div style={styles.orderSection}>
                                        <h4 style={styles.sectionTitle}>📸 Puzzle Photo</h4>
                                        <a href={order.imageUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={order.imageUrl} alt="Puzzle" style={styles.orderImage} />
                                        </a>
                                    </div>
                                )}

                                {/* Actions */}
                                <div style={styles.orderActions}>
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => markAsPaid(order.id)}
                                            disabled={updatingId === order.id}
                                            style={styles.btnConfirm}
                                        >
                                            {updatingId === order.id ? '⏳ Updating...' : '✓ Confirm Payment'}
                                        </button>
                                    )}

                                    <select
                                        value={order.deliveryStatus || 'pending'}
                                        onChange={(e) => updateDeliveryStatus(order.id, e.target.value)}
                                        disabled={updatingId === order.id}
                                        style={styles.deliverySelect}
                                    >
                                        <option value="pending">🕐 Delivery Pending</option>
                                        <option value="preparing">🧩 Preparing Puzzle</option>
                                        <option value="ready">✅ Ready for Pickup</option>
                                        <option value="delivered">🚚 Delivered</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '2rem 1rem',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    loginCard: {
        maxWidth: '400px',
        margin: '100px auto',
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '3rem 2rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    loginTitle: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '0.5rem',
    },
    loginSubtitle: {
        color: '#666',
        marginBottom: '2rem',
    },
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    passwordInput: {
        padding: '1rem',
        border: '2px solid #ddd',
        borderRadius: '10px',
        fontSize: '1rem',
        textAlign: 'center',
    },
    errorText: {
        color: '#f44336',
        fontSize: '0.9rem',
        margin: 0,
    },
    loginBtn: {
        padding: '1rem',
        backgroundColor: '#FF6B6B',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        fontSize: '1.8rem',
        color: '#333',
    },
    headerActions: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    btnRefresh: {
        padding: '0.5rem 1rem',
        backgroundColor: '#2196F3',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    btnExport: {
        padding: '0.5rem 1rem',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '1.5rem',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    statNumber: {
        display: 'block',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    statLabel: {
        display: 'block',
        fontSize: '0.85rem',
        color: '#666',
        marginTop: '0.25rem',
    },
    filterRow: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
    },
    filterBtn: {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #FF6B6B',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#666',
    },
    ordersList: {
        display: 'grid',
        gap: '1.5rem',
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    orderId: {
        fontSize: '1.2rem',
        color: '#333',
        marginBottom: '0.25rem',
    },
    orderDate: {
        fontSize: '0.85rem',
        color: '#999',
    },
    statusBadges: {
        display: 'flex',
        gap: '0.5rem',
    },
    badge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        color: '#fff',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    orderSection: {
        padding: '1rem 0',
        borderTop: '1px solid #eee',
    },
    sectionTitle: {
        fontSize: '1rem',
        color: '#333',
        marginBottom: '0.75rem',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.5rem',
        fontSize: '0.95rem',
        color: '#555',
    },
    orderImage: {
        maxWidth: '200px',
        borderRadius: '10px',
        cursor: 'pointer',
    },
    orderActions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #eee',
        flexWrap: 'wrap',
    },
    btnConfirm: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '600',
    },
    deliverySelect: {
        padding: '0.75rem 1rem',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '0.95rem',
        cursor: 'pointer',
    },
};

// Add spinner animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    if (!document.querySelector('[data-spinner-style]')) {
        style.setAttribute('data-spinner-style', 'true');
        document.head.appendChild(style);
    }
}
