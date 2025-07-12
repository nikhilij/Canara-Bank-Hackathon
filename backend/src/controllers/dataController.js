const Data = require('../models/Data');

// Data access controller
// TODO: Implement data access tracking and management
// Track data access
const trackDataAccess = async (req, res) => {
    try {
        const { userId, dataType, action, timestamp } = req.body;
        
        const dataAccess = new Data({
            userId,
            dataType,
            action,
            timestamp: timestamp || new Date(),
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        await dataAccess.save();
        
        res.status(201).json({
            success: true,
            message: 'Data access tracked successfully',
            data: dataAccess
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error tracking data access',
            error: error.message
        });
    }
};

// Get data access logs
const getDataAccessLogs = async (req, res) => {
    try {
        const { userId, dataType, startDate, endDate } = req.query;
        
        let filter = {};
        if (userId) filter.userId = userId;
        if (dataType) filter.dataType = dataType;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }
        
        const logs = await Data.find(filter).sort({ timestamp: -1 });
        
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving data access logs',
            error: error.message
        });
    }
};

// Delete data access logs
const deleteDataAccessLogs = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Data.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Data access log deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting data access log',
            error: error.message
        });
    }
};

module.exports = {
    trackDataAccess,
    getDataAccessLogs,
    deleteDataAccessLogs
};