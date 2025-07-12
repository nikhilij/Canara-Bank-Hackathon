const validator = require('validator');

// Validation utilities
// TODO: Implement input validation helpers
// Email validation
const isValidEmail = (email) => {
    return validator.isEmail(email);
};

// Phone number validation (Indian format)
const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Name validation (only alphabets and spaces)
const isValidName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name.trim()) && name.trim().length >= 2;
};

// PAN validation (Indian PAN format)
const isValidPAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
};

// Aadhaar validation (12 digits)
const isValidAadhaar = (aadhaar) => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar);
};

// Account number validation (10-18 digits)
const isValidAccountNumber = (accountNumber) => {
    const accountRegex = /^\d{10,18}$/;
    return accountRegex.test(accountNumber);
};

// IFSC code validation
const isValidIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
};

// Amount validation (positive number with up to 2 decimal places)
const isValidAmount = (amount) => {
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    return amountRegex.test(amount) && parseFloat(amount) > 0;
};

// Date validation (YYYY-MM-DD format)
const isValidDate = (date) => {
    return validator.isDate(date) && new Date(date) <= new Date();
};

// Generic field validation
const validateRequired = (value) => {
    return value !== undefined && value !== null && value.toString().trim() !== '';
};

// Length validation
const isValidLength = (value, min, max) => {
    const length = value ? value.toString().trim().length : 0;
    return length >= min && length <= max;
};

// Sanitize input
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return validator.escape(input.trim());
};

// Comprehensive validation function
const validateField = (value, rules) => {
    const errors = [];
    
    if (rules.required && !validateRequired(value)) {
        errors.push('This field is required');
        return errors;
    }
    
    if (value && rules.email && !isValidEmail(value)) {
        errors.push('Invalid email format');
    }
    
    if (value && rules.phone && !isValidPhone(value)) {
        errors.push('Invalid phone number format');
    }
    
    if (value && rules.password && !isValidPassword(value)) {
        errors.push('Password must be at least 8 characters with uppercase, lowercase, number and special character');
    }
    
    if (value && rules.name && !isValidName(value)) {
        errors.push('Name must contain only alphabets and spaces');
    }
    
    if (value && rules.pan && !isValidPAN(value)) {
        errors.push('Invalid PAN format');
    }
    
    if (value && rules.aadhaar && !isValidAadhaar(value)) {
        errors.push('Invalid Aadhaar number');
    }
    
    if (value && rules.accountNumber && !isValidAccountNumber(value)) {
        errors.push('Invalid account number');
    }
    
    if (value && rules.ifsc && !isValidIFSC(value)) {
        errors.push('Invalid IFSC code');
    }
    
    if (value && rules.amount && !isValidAmount(value)) {
        errors.push('Invalid amount format');
    }
    
    if (value && rules.date && !isValidDate(value)) {
        errors.push('Invalid date format');
    }
    
    if (value && rules.minLength && !isValidLength(value, rules.minLength, Infinity)) {
        errors.push(`Minimum length is ${rules.minLength}`);
    }
    
    if (value && rules.maxLength && !isValidLength(value, 0, rules.maxLength)) {
        errors.push(`Maximum length is ${rules.maxLength}`);
    }
    
    return errors;
};

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidName,
    isValidPAN,
    isValidAadhaar,
    isValidAccountNumber,
    isValidIFSC,
    isValidAmount,
    isValidDate,
    validateRequired,
    isValidLength,
    sanitizeInput,
    validateField
};