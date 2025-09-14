const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database to ensure user still exists
        const user = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [decoded.id]);
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }

        // Attach user info to request
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: user.rows[0].email
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Middleware to check user roles
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Access denied. No user found.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}` 
            });
        }
        
        next();
    };
};

// Specific role middlewares for convenience
const adminOnly = roleMiddleware(['admin']);
const storeOwnerOnly = roleMiddleware(['store_owner']);
const userOnly = roleMiddleware(['user']);
const storeOwnerOrAdmin = roleMiddleware(['store_owner', 'admin']);
const userOrStoreOwner = roleMiddleware(['user', 'store_owner']);

module.exports = {
    authMiddleware,
    roleMiddleware,
    adminOnly,
    storeOwnerOnly,
    userOnly,
    storeOwnerOrAdmin,
    userOrStoreOwner
};