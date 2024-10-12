const pool = require('../db');

// Get total sales month-wise for a specific product
const getSalesByProduct = async (req, res) => {
    const { product_id } = req.params; // Extract product_id from request parameters
    try {
        const salesData = await pool.query(
            `SELECT 
                DATE_TRUNC('month', sale_date) AS sale_month, 
                SUM(quantity_sold) AS total_quantity, 
                SUM(total_amount) AS total_revenue
             FROM sales
             WHERE product_id = $1
             GROUP BY sale_month
             ORDER BY sale_month`,
            [product_id]
        );

        res.json(salesData.rows); // Return the month-wise sales data
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get low stock alerts (give all stocks below set threshold)
const getStockAlerts = async (req, res) => {
    const threshold = 10; // default threshold is set to 10 (may change later as needed) 
    try {
        const lowStock = await pool.query('SELECT * FROM inventory WHERE quantity < $1', [threshold]);
        res.json(lowStock.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get revenue for a specified period (startDate and endDate is given and revenu is returned )
const getRevenue = async (req, res) => {
    const { startDate, endDate } = req.body; 
    try {
        const revenue = await pool.query(
            'SELECT SUM(total_amount) AS total_revenue FROM sales WHERE sale_date BETWEEN $1 AND $2',
            [startDate, endDate]
        );
        res.json(revenue.rows[0]); // Return the total revenue
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getSalesByProduct, getStockAlerts, getRevenue };
