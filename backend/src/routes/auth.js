const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST route for user signup
router.post('/signup', authController.signup);

// POST route for user login
router.post('/login', authController.login);

// PUT route for updating password (requires authentication)
router.put('/update-password', authMiddleware, authController.updatePassword);

module.exports = router;