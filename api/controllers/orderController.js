const pool = require('../db');

// Place a new order (status: pending)
const placeOrder = async (req, res) => {
    const { product_id, quantity, customer_name, order_date, supplier_id } = req.body;

    // Calculate total cost (this assumes you have the product price available, adjust as needed)
    const productQuery = await pool.query('SELECT sale_price FROM products WHERE product_id = $1', [product_id]);
    const sale_price = productQuery.rows[0]?.sale_price || 0;
    const total_cost = sale_price * quantity;

    try {
        const result = await pool.query(
            'INSERT INTO orders (product_id, quantity, customer_name, order_date, supplier_id, total_cost, status, claimed_lead_time, actual_delivery_date, actual_lead_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [product_id, quantity, customer_name, order_date, supplier_id, total_cost, 'pending', null, null, null]
        );

        res.status(201).json({ message: 'Order placed successfully', order: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};


/// Update order status (delivered or cancelled)
const updateOrderStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status, actual_delivery_date } = req.body;

    if (status !== 'delivered' && status !== 'cancelled') {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const orderResult = await pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // If order is delivered, we need to calculate the actual_lead_time and update the inventory
        if (status === 'delivered') {
            if (!actual_delivery_date) {
                return res.status(400).json({ error: 'actual_delivery_date is required for delivered orders' });
            }

            const actual_lead_time = Math.ceil((new Date(actual_delivery_date) - new Date(order.order_date)) / (1000 * 3600 * 24));

            await pool.query(
                'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2',
                [order.quantity, order.product_id]
            );

            await pool.query(
                'UPDATE orders SET status = $1, actual_delivery_date = $2, actual_lead_time = $3 WHERE order_id = $4',
                [status, actual_delivery_date, actual_lead_time, order_id]
            );

            return res.status(200).json({ message: 'Order delivered, inventory updated' });
        }

        // If order is cancelled, just update the status only
        await pool.query('UPDATE orders SET status = $1 WHERE order_id = $2', [status, order_id]);

        res.status(200).json({ message: `Order ${status}` });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};


// Get all suppliers for a specific product
const getSuppliersByProductId = async (req, res) => {
    const { product_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT s.supplier_id, s.supplier_name, ps.cost_price
             FROM productsuppliers ps
             JOIN suppliers s ON ps.supplier_id = s.supplier_id
             WHERE ps.product_id = $1`,
            [product_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No suppliers found for this product' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    placeOrder,
    updateOrderStatus,
    getSuppliersByProductId
};
