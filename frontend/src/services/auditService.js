// Audit service
// TODO: Implement audit API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const auditService = {
    // Get all audit logs
    getAuditLogs: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_BASE_URL}/audit${queryParams ? `?${queryParams}` : ''}`);
            if (!response.ok) throw new Error('Failed to fetch audit logs');
            return await response.json();
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            throw error;
        }
    },

    // Get audit log by ID
    getAuditLogById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/audit/${id}`);
            if (!response.ok) throw new Error('Failed to fetch audit log');
            return await response.json();
        } catch (error) {
            console.error('Error fetching audit log:', error);
            throw error;
        }
    },

    // Create new audit log
    createAuditLog: async (auditData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/audit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(auditData),
            });
            if (!response.ok) throw new Error('Failed to create audit log');
            return await response.json();
        } catch (error) {
            console.error('Error creating audit log:', error);
            throw error;
        }
    },

    // Update audit log
    updateAuditLog: async (id, auditData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/audit/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(auditData),
            });
            if (!response.ok) throw new Error('Failed to update audit log');
            return await response.json();
        } catch (error) {
            console.error('Error updating audit log:', error);
            throw error;
        }
    },

    // Delete audit log
    deleteAuditLog: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/audit/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete audit log');
            return await response.json();
        } catch (error) {
            console.error('Error deleting audit log:', error);
            throw error;
        }
    },

    // Get audit statistics
    getAuditStats: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/audit/stats`);
            if (!response.ok) throw new Error('Failed to fetch audit statistics');
            return await response.json();
        } catch (error) {
            console.error('Error fetching audit statistics:', error);
            throw error;
        }
    }
};