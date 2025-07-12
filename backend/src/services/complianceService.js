const ComplianceRule = require('../models/ComplianceRule');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Compliance service
// TODO: Implement compliance reporting and checks
class ComplianceService {
    // Check transaction against compliance rules
    async checkTransactionCompliance(transactionData) {
        const rules = await ComplianceRule.find({ isActive: true });
        const violations = [];

        for (const rule of rules) {
            const violation = await this.evaluateRule(rule, transactionData);
            if (violation) {
                violations.push(violation);
            }
        }

        return {
            isCompliant: violations.length === 0,
            violations: violations
        };
    }

    // Evaluate a specific rule against transaction
    async evaluateRule(rule, transactionData) {
        const { ruleType, threshold, conditions } = rule;

        switch (ruleType) {
            case 'AMOUNT_LIMIT':
                if (transactionData.amount > threshold) {
                    return {
                        ruleId: rule._id,
                        type: 'AMOUNT_EXCEEDED',
                        message: `Transaction amount ${transactionData.amount} exceeds limit ${threshold}`,
                        severity: 'HIGH'
                    };
                }
                break;

            case 'FREQUENCY_CHECK':
                const recentTransactions = await Transaction.countDocuments({
                    accountId: transactionData.accountId,
                    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                });
                
                if (recentTransactions > threshold) {
                    return {
                        ruleId: rule._id,
                        type: 'FREQUENCY_EXCEEDED',
                        message: `Daily transaction frequency ${recentTransactions} exceeds limit ${threshold}`,
                        severity: 'MEDIUM'
                    };
                }
                break;

            case 'SUSPICIOUS_PATTERN':
                const suspicious = await this.checkSuspiciousPattern(transactionData);
                if (suspicious) {
                    return {
                        ruleId: rule._id,
                        type: 'SUSPICIOUS_ACTIVITY',
                        message: 'Potentially suspicious transaction pattern detected',
                        severity: 'HIGH'
                    };
                }
                break;
        }

        return null;
    }

    // Check for suspicious patterns
    async checkSuspiciousPattern(transactionData) {
        const { accountId, amount, type, recipientId } = transactionData;

        // Check for round number amounts (potential structuring)
        if (amount % 1000 === 0 && amount >= 10000) {
            return true;
        }

        // Check for rapid successive transactions
        const recentSimilar = await Transaction.countDocuments({
            accountId,
            amount: { $gte: amount * 0.9, $lte: amount * 1.1 },
            createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
        });

        if (recentSimilar > 3) {
            return true;
        }

        return false;
    }

    // Generate compliance report
    async generateComplianceReport(dateRange) {
        const { startDate, endDate } = dateRange;
        
        const totalTransactions = await Transaction.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const flaggedTransactions = await Transaction.find({
            createdAt: { $gte: startDate, $lte: endDate },
            complianceStatus: 'FLAGGED'
        });

        const violationSummary = await this.getViolationSummary(startDate, endDate);

        return {
            period: { startDate, endDate },
            totalTransactions,
            flaggedCount: flaggedTransactions.length,
            complianceRate: ((totalTransactions - flaggedTransactions.length) / totalTransactions * 100).toFixed(2),
            violationSummary,
            flaggedTransactions: flaggedTransactions.map(t => ({
                id: t._id,
                amount: t.amount,
                type: t.type,
                timestamp: t.createdAt,
                violations: t.violations
            }))
        };
    }

    // Get violation summary by type
    async getViolationSummary(startDate, endDate) {
        const violations = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    complianceStatus: 'FLAGGED'
                }
            },
            {
                $unwind: '$violations'
            },
            {
                $group: {
                    _id: '$violations.type',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        return violations;
    }

    // Update compliance rules
    async updateComplianceRule(ruleId, updates) {
        return await ComplianceRule.findByIdAndUpdate(ruleId, updates, { new: true });
    }

    // Get all active compliance rules
    async getActiveRules() {
        return await ComplianceRule.find({ isActive: true });
    }

    // Flag account for manual review
    async flagAccountForReview(accountId, reason) {
        const account = await Account.findById(accountId);
        if (account) {
            account.complianceStatus = 'UNDER_REVIEW';
            account.flagReason = reason;
            account.flaggedAt = new Date();
            await account.save();
        }
        return account;
    }
}

module.exports = new ComplianceService();