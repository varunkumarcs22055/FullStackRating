const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/profile', userController.getUserDetails);

// Update current user password
router.put('/password', userController.updatePassword);

// Admin only routes
// Get all users (admin only)
router.get('/', userController.getAllUsers);

// Get user statistics (admin only) 
router.get('/stats', userController.getUserStats);

// Search users (admin only)
router.get('/search', userController.searchUsers);

// Get user by ID (admin only)
router.get('/:id', userController.getUserById);

// Create new user (admin only)
router.post('/', userController.createUser);

// Update user (admin only or self)
router.put('/:id', userController.updateUser);

// Delete user (admin only)
router.delete('/:id', userController.deleteUser);

module.exports = router;