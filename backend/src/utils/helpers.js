const crypto = require('crypto');

// Helper utilities
// TODO: Implement common helper functions
// Generate random string
const generateRandomString = (length = 10) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Format currency
const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (Indian format)
const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

// Format date
const formatDate = (date, format = 'DD/MM/YYYY') => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year);
};

// Sanitize string
const sanitizeString = (str) => {
    return str.replace(/[<>]/g, '');
};

// Calculate age from date of birth
const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

module.exports = {
    generateRandomString,
    formatCurrency,
    isValidEmail,
    isValidPhone,
    formatDate,
    sanitizeString,
    calculateAge
};