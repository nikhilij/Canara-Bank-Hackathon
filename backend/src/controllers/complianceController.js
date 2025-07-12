const complianceService = require('../services/complianceService');

// Compliance reporting controller
// TODO: Implement compliance reports and regulatory features
// Get compliance dashboard data
const getComplianceDashboard = async (req, res) => {
    try {
        const dashboardData = await complianceService.getDashboardData();
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch compliance dashboard data' });
    }
};

// Generate regulatory report
const generateRegulatoryReport = async (req, res) => {
    try {
        const { reportType, startDate, endDate } = req.body;
        const report = await complianceService.generateReport(reportType, startDate, endDate);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate regulatory report' });
    }
};

// Get compliance violations
const getComplianceViolations = async (req, res) => {
    try {
        const violations = await complianceService.getViolations();
        res.json(violations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch compliance violations' });
    }
};

// Submit compliance report
const submitComplianceReport = async (req, res) => {
    try {
        const reportData = req.body;
        const result = await complianceService.submitReport(reportData);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit compliance report' });
    }
};

module.exports = {
    getComplianceDashboard,
    generateRegulatoryReport,
    getComplianceViolations,
    submitComplianceReport
};