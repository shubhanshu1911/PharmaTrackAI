const express = require('express');
const router = express.Router();
const { placeOrder, updateOrderStatus } = require('../controllers/orderController');

router.post('/orders', placeOrder);

// Update status (delivered or cancelled)
router.put('/orders/:order_id/status', updateOrderStatus);

module.exports = router;
