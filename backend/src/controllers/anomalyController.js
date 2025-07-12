const anomalyService = require('../services/anomalyService');

// Anomaly detection controller
// TODO: Implement anomaly detection API endpoints
// Get anomalies for a specific account
exports.getAccountAnomalies = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { startDate, endDate } = req.query;
        
        const anomalies = await anomalyService.detectAccountAnomalies(accountId, startDate, endDate);
        
        res.json({
            success: true,
            data: anomalies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get system-wide anomalies
exports.getSystemAnomalies = async (req, res) => {
    try {
        const { severity, limit = 50 } = req.query;
        
        const anomalies = await anomalyService.detectSystemAnomalies(severity, limit);
        
        res.json({
            success: true,
            data: anomalies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Report false positive
exports.reportFalsePositive = async (req, res) => {
    try {
        const { anomalyId } = req.params;
        
        await anomalyService.markFalsePositive(anomalyId);
        
        res.json({
            success: true,
            message: 'Anomaly marked as false positive'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};