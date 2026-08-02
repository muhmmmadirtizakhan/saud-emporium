const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const verifyToken = require('../middleware/auth');

// GET /api/wishlist
router.get('/', verifyToken, wishlistController.getWishlist);

// POST /api/wishlist
router.post('/', verifyToken, wishlistController.addToWishlist);

// DELETE /api/wishlist/:id
router.delete('/:id', verifyToken, wishlistController.removeFromWishlist);

// DELETE /api/wishlist/product/:productId
router.delete('/product/:productId', verifyToken, wishlistController.removeByProductId);

module.exports = router;