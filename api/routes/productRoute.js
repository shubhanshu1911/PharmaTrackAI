const express = require('express');
const router = express.Router();
const { getProductIDByName, searchProducts } = require('../controllers/productController');

// Route to get product ID by name
router.post('/product-id', getProductIDByName);

// Route to search products by query string
router.get('/products', searchProducts);

module.exports = router;
