import axios from 'axios';

const api = axios.create({
    // Use /api to leverage the Vite proxy we already set up
    baseURL: '/api',
});

// Add JWT token to all requests
api.interceptors.request.use(config => {
    // Check for admin token first, then fallback to student token (or handle separately)
    // The prompt specifies 'admin-token'
    const token = localStorage.getItem('admin-token');
    if (token) config.headers.token = token; // Backend expects 'token' header, not 'Authorization'
    return config;
});

// Handle token expiration or unauthorized
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Optional: Redirect to login if token invalid
            // localStorage.removeItem('admin-token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
