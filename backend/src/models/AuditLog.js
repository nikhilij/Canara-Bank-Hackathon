const mongoose = require('mongoose');

// AuditLog model
// TODO: Define audit log schema
const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT']
    },
    resource: {
        type: String,
        required: true
    },
    resourceId: {
        type: String
    },
    details: {
        type: Object,
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE', 'PENDING'],
        default: 'SUCCESS'
    }
}, {
    timestamps: true
});

// Index for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);