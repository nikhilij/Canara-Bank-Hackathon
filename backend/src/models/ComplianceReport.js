const mongoose = require('mongoose');

// ComplianceReport model
// TODO: Define compliance report schema
const complianceReportSchema = new mongoose.Schema({
    reportId: {
        type: String,
        required: true,
        unique: true
    },
    generatedDate: {
        type: Date,
        default: Date.now
    },
    reportType: {
        type: String,
        required: true,
        enum: ['REGULATORY', 'INTERNAL', 'AUDIT', 'RISK_ASSESSMENT']
    },
    complianceMetrics: {
        totalTransactions: {
            type: Number,
            default: 0
        },
        flaggedTransactions: {
            type: Number,
            default: 0
        },
        complianceScore: {
            type: Number,
            min: 0,
            max: 100
        },
        riskLevel: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            default: 'LOW'
        }
    },
    violations: [{
        violationType: {
            type: String,
            required: true
        },
        description: String,
        severity: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        },
        transactionId: String,
        detectedAt: {
            type: Date,
            default: Date.now
        }
    }],
    recommendations: [{
        category: String,
        description: String,
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
        }
    }],
    status: {
        type: String,
        enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'],
        default: 'DRAFT'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    metadata: {
        reportPeriod: {
            startDate: Date,
            endDate: Date
        },
        department: String,
        regulatoryFramework: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ComplianceReport', complianceReportSchema);