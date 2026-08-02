const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

// PUT /api/users/update
router.put('/update', verifyToken, userController.updateProfile);

// PUT /api/users/change-password
router.put('/change-password', verifyToken, userController.changePassword);

module.exports = router;