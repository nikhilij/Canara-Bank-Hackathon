// Compliance service
// TODO: Implement compliance API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ComplianceService {
    async checkCompliance(transactionData) {
        try {
            const response = await fetch(`${API_BASE_URL}/compliance/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });
            
            if (!response.ok) {
                throw new Error('Compliance check failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Compliance check error:', error);
            throw error;
        }
    }

    async getComplianceReport(accountId) {
        try {
            const response = await fetch(`${API_BASE_URL}/compliance/report/${accountId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch compliance report');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Compliance report error:', error);
            throw error;
        }
    }

    async updateComplianceRules(rules) {
        try {
            const response = await fetch(`${API_BASE_URL}/compliance/rules`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rules),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update compliance rules');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Compliance rules update error:', error);
            throw error;
        }
    }
}

export default new ComplianceService();