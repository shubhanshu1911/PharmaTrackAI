const express = require('express');
const router = express.Router();
const { placeOrder, updateOrderStatus , getSuppliersByProductId, getAllOrders} = require('../controllers/orderController');

router.post('/orders', placeOrder);

// Update status (delivered or cancelled)
router.put('/orders/:order_id/status', updateOrderStatus);

router.get('/suppliers/:product_id', getSuppliersByProductId);

// Route to get all orders
router.get('/orders', getAllOrders);

module.exports = router;
