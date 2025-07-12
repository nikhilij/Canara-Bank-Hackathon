// Constants
// TODO: Define application constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    TRANSACTIONS: '/transactions',
    ACCOUNTS: '/accounts'
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh'
    },
    USERS: {
        PROFILE: '/users/profile',
        UPDATE: '/users/update'
    },
    ACCOUNTS: {
        LIST: '/accounts',
        BALANCE: '/accounts/balance',
        TRANSACTIONS: '/accounts/transactions'
    }
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data',
    THEME: 'theme_preference'
};

export const MESSAGES = {
    SUCCESS: {
        LOGIN: 'Login successful',
        REGISTER: 'Registration successful',
        UPDATE: 'Profile updated successfully'
    },
    ERROR: {
        NETWORK: 'Network error occurred',
        UNAUTHORIZED: 'Please login to continue',
        GENERIC: 'Something went wrong'
    }
};