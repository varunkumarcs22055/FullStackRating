// Simple in-memory user store for testing without database
const bcryptjs = require('bcryptjs');

// In-memory users (for demo purposes)
let users = [];

// Initialize with demo users
const initializeUsers = async () => {
    if (users.length === 0) {
        const adminHash = await bcryptjs.hash('Password123!', 10);
        const storeHash = await bcryptjs.hash('Password123!', 10);
        const userHash = await bcryptjs.hash('Password123!', 10);

        users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@demo.com',
                password: adminHash,
                role: 'admin',
                is_verified: true,
                created_at: new Date()
            },
            {
                id: 2,
                name: 'Store Owner',
                email: 'store@demo.com',
                password: storeHash,
                role: 'store_owner',
                is_verified: true,
                created_at: new Date()
            },
            {
                id: 3,
                name: 'Regular User',
                email: 'user@demo.com',
                password: userHash,
                role: 'user',
                is_verified: true,
                created_at: new Date()
            }
        ];
        console.log('Initialized demo users in memory');
    }
};

// User operations
const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

const createUser = (userData) => {
    const newUser = {
        id: users.length + 1,
        ...userData,
        created_at: new Date()
    };
    users.push(newUser);
    return newUser;
};

const findUserById = (id) => {
    return users.find(user => user.id === id);
};

module.exports = {
    initializeUsers,
    findUserByEmail,
    createUser,
    findUserById,
    users // for debugging
};