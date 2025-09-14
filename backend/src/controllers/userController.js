const { pool } = require('../config/database');
const User = require('../models/User');
const { validateUser, validatePassword } = require('../utils/validation');

const userController = {
    // Get current user details
    getUserDetails: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'User not found' 
                });
            }

            // Remove password from response
            delete user.password;
            res.json({ 
                success: true,
                user 
            });
        } catch (error) {
            console.error('Get user details error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Server error' 
            });
        }
    },

    // Get all users (admin only)
    getAllUsers: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const users = await User.findAll();
            res.json({
                success: true,
                users
            });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }
    },

    // Get user by ID (admin only)
    getUserById: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const { id } = req.params;
            const user = await User.findById(id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            delete user.password;
            res.json({
                success: true,
                user
            });
        } catch (error) {
            console.error('Get user by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user'
            });
        }
    },

    // Create new user (admin only)
    createUser: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const { error } = validateUser(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const { name, email, password, role, address } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            const user = await User.create({
                name,
                email,
                password,
                role,
                address
            });

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user
            });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create user'
            });
        }
    },

    // Update user (admin or self)
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, address, role } = req.body;

            // Check permissions
            if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this user'
                });
            }

            // Only admin can update role
            const updateData = { name, email, address };
            if (req.user.role === 'admin' && role) {
                updateData.role = role;
            }

            const user = await User.update(id, updateData);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User updated successfully',
                user
            });
        } catch (error) {
            console.error('Update user error:', error);
            if (error.code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Failed to update user'
            });
        }
    },

    // Update password (self only)
    updatePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            const { error } = validatePassword({ password: newPassword });
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            // Get current user with password
            const currentUser = await User.findById(userId);
            if (!currentUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Verify current password
            const isValidPassword = await User.verifyPassword(currentPassword, currentUser.password);
            if (!isValidPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            await User.updatePassword(userId, newPassword);

            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            console.error('Update password error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update password'
            });
        }
    },

    // Delete user (admin only)
    deleteUser: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const { id } = req.params;
            
            // Prevent admin from deleting themselves
            if (req.user.id === parseInt(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete your own account'
                });
            }

            const deletedUser = await User.delete(id);
            
            if (!deletedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete user'
            });
        }
    },

    // Search users (admin only)
    searchUsers: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const { q } = req.query;
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const users = await User.search(q);
            res.json({
                success: true,
                users
            });
        } catch (error) {
            console.error('Search users error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search users'
            });
        }
    },

    // Get user statistics (admin only)
    getUserStats: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const stats = await User.getStats();
            res.json({
                success: true,
                stats
            });
        } catch (error) {
            console.error('Get user stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user statistics'
            });
        }
    }
};

module.exports = userController;