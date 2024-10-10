const pool = require('../db');

//add sale
const addSale = async (req, res) => {
    const { product_id, quantity_sold, customer_name = 'Unknown' } = req.body; 

    try {
       
        const productInventory = await pool.query('SELECT quantity, price FROM inventory WHERE product_id = $1', [product_id]);
        
        if (productInventory.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found in inventory' });
        }

        const currentQuantity = productInventory.rows[0].quantity;
        const pricePerUnit = productInventory.rows[0].price;
        
        if (currentQuantity < quantity_sold) {
            return res.status(400).json({ error: 'Insufficient stock to complete sale' });
        }

        const totalAmount = pricePerUnit * quantity_sold;

       
        await pool.query(
            'INSERT INTO sales (product_id, quantity_sold, sale_date, total_amount, customer_name) VALUES ($1, $2, NOW(), $3, $4)',
            [product_id, quantity_sold, totalAmount, customer_name]
        );

       
        await pool.query('UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2', [quantity_sold, product_id]);

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
