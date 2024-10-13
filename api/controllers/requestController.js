const pool = require('../db');  // Assuming you are using `pg` for PostgreSQL

// Add a new customer request
exports.addRequest = async (req, res) => {
    try {
        const { customer_name = 'unknown', request_date, quantity_requested, product_id } = req.body;

        // Insert the new request into the CustomerRequests table
        const query = `
            INSERT INTO CustomerRequests (customer_name, product_id, request_date, quantity_requested)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [customer_name, product_id, request_date, quantity_requested];

        const result = await pool.query(query, values);
        res.status(201).json({
            message: 'Request added successfully!',
            request: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all customer requests
exports.getAllRequests = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM CustomerRequests ORDER BY request_date DESC;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
