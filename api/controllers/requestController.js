const pool = require('../db');  // Assuming you are using `pg` for PostgreSQL

// Add a new customer request
exports.addRequest = async (req, res) => {
    try {
        const { customer_name = 'unknown', request_date, quantity_requested, product_id } = req.body;

        // Check if all fields are present
        if (!product_id || !request_date || !quantity_requested) {
            return res.status(400).json({ error: 'Required fields are missing.' });
        }

        // Insert the new request into the CustomerRequests table
        const query = `
            INSERT INTO customer_requests (customer_name, product_id, request_date, quantity_requested)
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
        res.status(500).json({ error: 'Internal Server Error', details: error.message }); // Include more details in response
    }
};


// Get weekly requests for each product
exports.getWeeklyRequests = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                product_id,
                DATE_TRUNC('week', request_date) AS week,
                COUNT(*) AS request_count
            FROM 
                customer_requests
            GROUP BY 
                product_id, week
            ORDER BY 
                week DESC, product_id;
        `);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching weekly requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

