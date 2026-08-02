const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/auth');

// POST /api/orders
router.post('/', verifyToken, orderController.createOrder);

// GET /api/orders
router.get('/', verifyToken, orderController.getOrders);

// GET /api/orders/:id
router.get('/:id', verifyToken, orderController.getOrderById);

module.exports = router;