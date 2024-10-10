const pool = require('../db');

// Get sales data by product
const getSalesByProduct = async (req, res) => {
    try {
        const salesData = await pool.query(
            'SELECT product_id, SUM(quantity_sold) AS total_quantity, SUM(total_amount) AS total_revenue FROM sales GROUP BY product_id'
        );
        res.json(salesData.rows);
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
    const { startDate, endDate } = req.query;
    try {
        const revenue = await pool.query(
            'SELECT SUM(total_amount) AS total_revenue FROM sales WHERE sale_date BETWEEN $1 AND $2',
            [startDate, endDate]
        );
        res.json(revenue.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getSalesByProduct, getStockAlerts, getRevenue };
