const { validationResult } = require('express-validator');

// Centralized validation middleware for API routes


/**
 * Handles validation results from express-validator.
 * If validation errors exist, responds with 400 and error details.
 * Otherwise, proceeds to next middleware.
 */
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};
