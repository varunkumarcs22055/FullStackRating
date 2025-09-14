import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust the base URL according to your backend server
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to handle token in headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Function to handle API responses
const handleResponse = (response) => {
    return response.data;
};

// Function to handle API errors
const handleError = (error) => {
    if (error.response) {
        throw new Error(error.response.data.message || 'An error occurred');
    }
    throw new Error('Network error');
};

// Exporting utility functions
export const get = (url) => {
    return api.get(url).then(handleResponse).catch(handleError);
};

export const post = (url, data) => {
    return api.post(url, data).then(handleResponse).catch(handleError);
};

export const put = (url, data) => {
    return api.put(url, data).then(handleResponse).catch(handleError);
};

export const del = (url) => {
    return api.delete(url).then(handleResponse).catch(handleError);
};