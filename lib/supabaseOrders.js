import { supabase } from './supabaseClient';

/**
 * Submit a new order to Supabase
 * @param {Object} orderData - The order data
 * @returns {Promise<string>} - The order ID
 */
export async function submitOrder(orderData) {
    const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
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

    return data || [];
}

/**
 * Update order status (e.g., mark payment as confirmed)
 * @param {string} orderId - The order ID
 * @param {Object} updates - Fields to update
 */
export async function updateOrder(orderId, updates) {
    const { error } = await supabase
        .from('orders')
        .update(updates)
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
