const pool = require('../db');

// Place a new order (status: pending)
const placeOrder = async (req, res) => {
    const { product_id, quantity, customer_name } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO orders (product_id, quantity, customer_name, order_status, actual_lead_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [product_id, quantity, customer_name, 'pending', null]
        );

        res.status(201).json({ message: 'Order placed successfully', order: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update order status (delivered or cancelled)
const updateOrderStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status, actual_lead_time } = req.body;

    if (status !== 'delivered' && status !== 'cancelled') {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const orderResult = await pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // If order is delivered, we need to update the actual_lead_time and inventory
        if (status === 'delivered') {
            if (!actual_lead_time) {
                return res.status(400).json({ error: 'actual_lead_time is required for delivered orders' });
            }

            await pool.query(
                'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2',
                [order.quantity, order.product_id]
            );

            await pool.query(
                'UPDATE orders SET order_status = $1, actual_lead_time = $2 WHERE order_id = $3',
                [status, actual_lead_time, order_id]
            );

            return res.status(200).json({ message: 'Order delivered, inventory updated' });
        }

        // If order is cancelled, just update the status only
        await pool.query('UPDATE orders SET order_status = $1 WHERE order_id = $2', [status, order_id]);

        res.status(200).json({ message: `Order ${status}` });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    placeOrder,
    updateOrderStatus
};
