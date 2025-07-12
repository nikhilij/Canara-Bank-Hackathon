// User service
// TODO: Implement user API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const userService = {
    // Get user profile
    async getProfile(userId) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch user profile');
        return response.json();
    },

    // Update user profile
    async updateProfile(userId, userData) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to update user profile');
        return response.json();
    },

    // Login user
    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    // Register user
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
    },

    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem('token') !== null;
    }
};