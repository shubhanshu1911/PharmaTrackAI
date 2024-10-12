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


const getSalesByYear = async (req, res) => {
    const { year } = req.body;

    if (!year || isNaN(year)) {
        return res.status(400).json({ message: 'Invalid or missing year in the request.' });
    }

    try {
        // Query for total sales for the entire year
        const totalSalesQuery = `
            SELECT COALESCE(SUM(total_amount), 0) AS total_revenue
            FROM sales
            WHERE EXTRACT(YEAR FROM sale_date) = $1
        `;
        const totalSalesResult = await pool.query(totalSalesQuery, [year]);
        const totalRevenue = totalSalesResult.rows[0].total_revenue;

        // Query for monthly sales breakdown
        const monthlySalesQuery = `
            SELECT
                EXTRACT(MONTH FROM sale_date) AS month,
                COALESCE(SUM(total_amount), 0) AS monthly_revenue
            FROM sales
            WHERE EXTRACT(YEAR FROM sale_date) = $1
            GROUP BY month
            ORDER BY month
        `;
        const monthlySalesResult = await pool.query(monthlySalesQuery, [year]);

        // Create a response array for all months, initializing to 0 for months with no sales
        const monthlySalesBreakdown = Array(12).fill(0); // [0, 0, 0, ..., 0]

        // Populate the response array with actual monthly sales
        monthlySalesResult.rows.forEach(row => {
            const monthIndex = row.month - 1; // Months are 1-based, so subtract 1 for 0-based index
            monthlySalesBreakdown[monthIndex] = row.monthly_revenue;
        });

        res.json({
            year,
            totalRevenue,
            monthlySalesBreakdown,
        });
    } catch (err) {
        console.error('Error fetching sales data by year:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getSalesByProduct, getStockAlerts, getRevenue, getSalesByYear };
