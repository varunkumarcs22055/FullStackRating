const Joi = require('joi');

// Validation schemas
const signupSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
        }),
    role: Joi.string().valid('user', 'store_owner', 'admin').default('user')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// User validation schema (for admin user creation)
const userSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
        }),
    role: Joi.string().valid('user', 'store_owner', 'admin').default('user'),
    address: Joi.string().max(500).allow('').default('')
});

// Password validation schema
const passwordSchema = Joi.object({
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
        })
});

// Store validation schema
const storeSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(5).max(500).required(),
    owner_id: Joi.number().integer().positive().optional()
});

// Rating validation schema
const ratingSchema = Joi.object({
    store_id: Joi.number().integer().positive().required(),
    rating: Joi.number().integer().min(1).max(5).required()
});

// Validation functions
const validateSignup = (data) => {
    return signupSchema.validate(data);
};

const validateLogin = (data) => {
    return loginSchema.validate(data);
};

const validateUser = (data) => {
    return userSchema.validate(data);
};

const validatePassword = (data) => {
    return passwordSchema.validate(data);
};

const validateStore = (data) => {
    return storeSchema.validate(data);
};

const validateRating = (data) => {
    return ratingSchema.validate(data);
};

// Legacy validation functions (keeping for backward compatibility)
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePasswordLegacy = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
};

const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]{3,30}$/;
    return re.test(String(username));
};

module.exports = {
    validateSignup,
    validateLogin,
    validateUser,
    validatePassword,
    validateStore,
    validateRating,
    validateEmail,
    validatePasswordLegacy,
    validateUsername
};