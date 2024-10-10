const dotenv = require('dotenv');
const pool = require('./db');
const express = require('express');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Importing routes
const salesRoutes = require('./routes/salesRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes'); // Add this
const analyticsRoutes = require('./routes/analyticsRoutes'); // Add this

// Use routes with a versioned base path
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/inventory', inventoryRoutes); // Add this
app.use('/api/v1/analytics', analyticsRoutes); // Add this

// Database connection
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Error-handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
