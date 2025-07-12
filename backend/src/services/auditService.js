const fs = require('fs').promises;
const path = require('path');

// Audit service
// TODO: Implement audit logging functionality
class AuditService {
    constructor() {
        this.logFile = path.join(__dirname, '../logs/audit.log');
        this.ensureLogDirectory();
    }

    async ensureLogDirectory() {
        const logDir = path.dirname(this.logFile);
        try {
            await fs.mkdir(logDir, { recursive: true });
        } catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }

    async logActivity(userId, action, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            userId,
            action,
            details,
            ip: details.ip || 'unknown'
        };

        const logLine = JSON.stringify(logEntry) + '\n';
        
        try {
            await fs.appendFile(this.logFile, logLine);
        } catch (error) {
            console.error('Failed to write audit log:', error);
        }
    }

    async getAuditLogs(filters = {}) {
        try {
            const data = await fs.readFile(this.logFile, 'utf8');
            const logs = data.split('\n')
                .filter(line => line.trim())
                .map(line => JSON.parse(line));

            return this.filterLogs(logs, filters);
        } catch (error) {
            console.error('Failed to read audit logs:', error);
            return [];
        }
    }

    filterLogs(logs, filters) {
        return logs.filter(log => {
            if (filters.userId && log.userId !== filters.userId) return false;
            if (filters.action && log.action !== filters.action) return false;
            if (filters.startDate && new Date(log.timestamp) < new Date(filters.startDate)) return false;
            if (filters.endDate && new Date(log.timestamp) > new Date(filters.endDate)) return false;
            return true;
        });
    }
}

module.exports = new AuditService();