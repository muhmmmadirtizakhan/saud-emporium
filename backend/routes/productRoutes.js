const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products/bestsellers
router.get('/bestsellers', productController.getBestsellers);

// GET /api/products/new-arrivals
router.get('/new-arrivals', productController.getNewArrivals);

// GET /api/products/category/:category
router.get('/category/:category', productController.getByCategory);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;