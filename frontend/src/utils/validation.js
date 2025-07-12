// Validation utilities
// TODO: Implement validation functions
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
};

export const validateAccountNumber = (accountNumber) => {
    return /^\d{10,16}$/.test(accountNumber);
};

export const validateAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
};

export const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
};

export const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
};

export const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
};

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateForm = (formData, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const rule = rules[field];
        const value = formData[field];
        
        if (rule.required && !validateRequired(value)) {
            errors[field] = `${field} is required`;
            return;
        }
        
        if (value && rule.validator && !rule.validator(value)) {
            errors[field] = rule.message || `Invalid ${field}`;
        }
    });
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};