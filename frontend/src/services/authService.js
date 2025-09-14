import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Signup function
const signup = async (userData) => {
    try {
        const response = await api.post('signup', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Network error occurred' };
    }
};

// Login function
const login = async (userData) => {
    try {
        const response = await api.post('login', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Network error occurred' };
    }
};

// Logout function
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

// Get current user token
const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return token ? { token, role } : null;
};

// Check if user is authenticated
const isAuthenticated = () => {
    try {
        const token = localStorage.getItem('token');
        return !!token;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
};

// Get user role
const getUserRole = () => {
    try {
        return localStorage.getItem('role') || 'user';
    } catch (error) {
        console.error('Error getting user role:', error);
        return 'user';
    }
};

// Check if user has specific role
const hasRole = (requiredRole) => {
    const userRole = getUserRole();
    return userRole === requiredRole;
};

const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    getUserRole,
    hasRole,
};

export default authService;