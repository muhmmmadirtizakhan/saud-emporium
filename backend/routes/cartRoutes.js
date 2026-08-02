const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/auth');

// GET /api/cart
router.get('/', verifyToken, cartController.getCart);

// POST /api/cart
router.post('/', verifyToken, cartController.addToCart);

// PUT /api/cart/:id
router.put('/:id', verifyToken, cartController.updateCart);

// DELETE /api/cart/:id
router.delete('/:id', verifyToken, cartController.removeFromCart);

// DELETE /api/cart
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;