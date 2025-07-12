const mongoose = require('mongoose');

// DataAccess model
// TODO: Define data access tracking schema
const dataAccessSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resourceType: {
        type: String,
        required: true,
        enum: ['account', 'transaction', 'profile', 'loan', 'investment']
    },
    resourceId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['read', 'write', 'update', 'delete']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    },
    success: {
        type: Boolean,
        default: true
    },
    errorMessage: {
        type: String
    }
}, {
    timestamps: true
});

dataAccessSchema.index({ userId: 1, timestamp: -1 });
dataAccessSchema.index({ resourceType: 1, resourceId: 1 });

module.exports = mongoose.model('DataAccess', dataAccessSchema);