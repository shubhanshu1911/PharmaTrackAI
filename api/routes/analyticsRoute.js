const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');


router.get('/sales-by-product/:product_id', analyticsController.getSalesByProduct);


router.get('/stock-alerts', analyticsController.getStockAlerts);


router.get('/revenue', analyticsController.getRevenue);

router.post('/sales-by-year', analyticsController.getSalesByYear);

module.exports = router;


