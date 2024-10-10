const express = require('express');
const router = express.Router();
const { placeOrder, updateOrderStatus , getSuppliersByProductId} = require('../controllers/orderController');

router.post('/orders', placeOrder);

// Update status (delivered or cancelled)
router.put('/orders/:order_id/status', updateOrderStatus);

router.get('/suppliers/:product_id', getSuppliersByProductId);

module.exports = router;
