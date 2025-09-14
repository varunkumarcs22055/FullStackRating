const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validateSignup, validateLogin } = require('../utils/validation');
const { initializeUsers, findUserByEmail, createUser } = require('../utils/memoryStore');
const User = require('../models/User');
require('dotenv').config();

// Initialize memory store
initializeUsers();

// Helper function to use database or memory store
const useDatabase = async () => {
    try {
        const client = await pool.connect();
        client.release();
        return true;
    } catch (err) {
        return false;
    }
};

// Signup function
exports.signup = async (req, res) => {
    try {
        // Validate input
        const { error } = validateSignup(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { name, email, password, role } = req.body;
        const dbAvailable = await useDatabase();

        if (dbAvailable) {
            // Use database
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashed = await bcryptjs.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id, role',
                [name, email, hashed, role || 'user']
            );

            const token = jwt.sign(
                { id: result.rows[0].id, role: result.rows[0].role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            res.status(201).json({ 
                token, 
                role: result.rows[0].role,
                message: 'User created successfully'
            });
        } else {
            // Use memory store
            const existingUser = findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashed = await bcryptjs.hash(password, 10);
            const newUser = createUser({
                name,
                email,
                password: hashed,
                role: role || 'user',
                is_verified: false
            });

            const token = jwt.sign(
                { id: newUser.id, role: newUser.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            res.status(201).json({ 
                token, 
                role: newUser.role,
                message: 'User created successfully (using memory store)'
            });
        }
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        // Validate input
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = req.body;
        const dbAvailable = await useDatabase();

        if (dbAvailable) {
            // Use database
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (user.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const valid = await bcryptjs.compare(password, user.rows[0].password);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.rows[0].id, role: user.rows[0].role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            res.json({ 
                token, 
                role: user.rows[0].role,
                message: 'Login successful'
            });
        } else {
            // Use memory store
            const user = findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const valid = await bcryptjs.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            res.json({ 
                token, 
                role: user.role,
                message: 'Login successful (using memory store)'
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update password function
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password and new password are required' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters long' 
            });
        }
        
        const dbAvailable = await useDatabase();
        
        if (dbAvailable) {
            // Database implementation
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            
            // Verify current password
            const isValidPassword = await bcryptjs.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Current password is incorrect' 
                });
            }
            
            // Hash new password and update
            const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
            await User.updatePassword(userId, hashedNewPassword);
            
            res.json({ 
                success: true, 
                message: 'Password updated successfully' 
            });
        } else {
            // Memory store implementation
            const user = memoryStore.findUserById(userId);
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            
            // Verify current password
            const isValidPassword = await bcryptjs.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Current password is incorrect' 
                });
            }
            
            // Hash new password and update
            const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
            user.password = hashedNewPassword;
            
            res.json({ 
                success: true, 
                message: 'Password updated successfully' 
            });
        }
    } catch (err) {
        console.error('Update password error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};