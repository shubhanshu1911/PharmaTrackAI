const pool = require('../db');

const addSale = async (req, res) => {
    const { product_id, quantity_sold, customer_name = 'Unknown', sale_date } = req.body;

    try {
        // Get the product's sale price from the Products table
        const productInfo = await pool.query(
            'SELECT total_pills, sale_price FROM products WHERE product_id = $1',
            [product_id]
        );

        // Check if the product exists
        if (productInfo.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found in products table' });
        }

        const currentTotalPills = productInfo.rows[0].total_pills;
        const pricePerUnit = productInfo.rows[0].sale_price;

        // Check if there is enough stock
        if (currentTotalPills < quantity_sold) {
            return res.status(400).json({ error: 'Insufficient stock to complete sale' });
        }

        // Calculate the total amount for the sale
        const totalAmount = pricePerUnit * quantity_sold;

        // Insert the sale into the Sales table
        await pool.query(
            'INSERT INTO sales (product_id, quantity_sold, sale_date, total_amount, customer_name) VALUES ($1, $2, $3, $4, $5)',
            [product_id, quantity_sold, sale_date, totalAmount, customer_name]
        );

        // Update the total pills in the Products table (decrement the stock)
        await pool.query(
            'UPDATE products SET total_pills = total_pills - $1 WHERE product_id = $2',
            [quantity_sold, product_id]
        );

        res.status(201).json({ message: 'Sale recorded successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};



// Get all sales
const getAllSales = async (req, res) => {
    try {
        const sales = await pool.query('SELECT * FROM sales');
        res.json(sales.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get particular sale by ID
const getSaleById = async (req, res) => {
    const { sale_id } = req.params;
    try {
        const sale = await pool.query('SELECT * FROM sales WHERE sale_id = $1', [sale_id]);

        if (sale.rows.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        res.json(sale.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { addSale, getAllSales, getSaleById};
