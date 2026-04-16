import { supabase } from './supabaseClient';

/**
 * Submit a new order to Supabase
 * @param {Object} orderData - The order data
 * @returns {Promise<string>} - The order ID
 */
export async function submitOrder(orderData) {
    // Map camelCase JS object to snake_case database columns
    const dbOrderData = {
        customer_name: orderData.customerName,
        phone: orderData.phone,
        email: orderData.email,
        delivery_type: orderData.deliveryType,
        school_name: orderData.schoolName || null,
        home_address: orderData.homeAddress || null,
        home_city: orderData.homeCity || null,
        home_phone: orderData.homePhone || null,
        payment_method: orderData.paymentMethod,
        price: orderData.price,
        currency: orderData.currency,
        status: orderData.status,
        image_url: orderData.imageUrl,
        created_at: orderData.createdAt
    };

    const { data, error } = await supabase
        .from('orders')
        .insert([dbOrderData])
        .select()
        .single();

    if (error) {
        console.error('Order submission error:', error);
        throw new Error(`Failed to submit order: ${error.message}`);
    }

    return data.id;
}

/**
 * Get all orders (for admin)
 * @returns {Promise<Array>} - Array of orders
 */
export async function getAllOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    if (!data) return [];

    // Map snake_case back to camelCase for the frontend
    return data.map(order => ({
        id: order.id,
        customerName: order.customer_name,
        phone: order.phone,
        email: order.email,
        deliveryType: order.delivery_type,
        schoolName: order.school_name,
        homeAddress: order.home_address,
        homeCity: order.home_city,
        homePhone: order.home_phone,
        paymentMethod: order.payment_method,
        price: order.price,
        currency: order.currency,
        status: order.status,
        deliveryStatus: order.delivery_status,
        imageUrl: order.image_url,
        createdAt: order.created_at,
        paymentConfirmedAt: order.payment_confirmed_at,
        deliveryUpdatedAt: order.delivery_updated_at,
        notes: order.notes
    }));
}

/**
 * Update order status (e.g., mark payment as confirmed)
 * @param {string} orderId - The order ID
 * @param {Object} updates - Fields to update (comes in camelCase)
 */
export async function updateOrder(orderId, updates) {
    // Map camelCase updates to snake_case
    const dbUpdates = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.paymentConfirmedAt !== undefined) dbUpdates.payment_confirmed_at = updates.paymentConfirmedAt;
    if (updates.deliveryStatus !== undefined) dbUpdates.delivery_status = updates.deliveryStatus;
    if (updates.deliveryUpdatedAt !== undefined) dbUpdates.delivery_updated_at = updates.deliveryUpdatedAt;
    
    const { error } = await supabase
        .from('orders')
        .update(dbUpdates)
        .eq('id', orderId);

    if (error) {
        console.error('Error updating order:', error);
        throw new Error(`Failed to update order: ${error.message}`);
    }
}

/**
 * Export orders as JSON (for backup/CSV conversion)
 * @returns {Promise<string>} - JSON string of all orders
 */
export async function exportOrdersAsJSON() {
    const orders = await getAllOrders();
    return JSON.stringify(orders, null, 2);
}
