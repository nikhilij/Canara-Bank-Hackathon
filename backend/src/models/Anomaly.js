const mongoose = require('mongoose');

// Anomaly model
// TODO: Define anomaly detection schema
const anomalySchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    anomalyType: {
        type: String,
        required: true,
        enum: ['unusual_amount', 'unusual_location', 'unusual_time', 'unusual_frequency', 'suspicious_merchant']
    },
    severity: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'critical']
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    description: {
        type: String,
        required: true
    },
    transactionDetails: {
        amount: Number,
        merchant: String,
        location: String,
        timestamp: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'reviewed', 'false_positive', 'confirmed'],
        default: 'pending'
    },
    reviewedBy: {
        type: String,
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Anomaly', anomalySchema);