// Anomaly detection service
// TODO: Implement anomaly detection API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const anomalyService = {
    // Detect anomalies in transaction data
    async detectAnomalies(transactionData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/anomalies/detect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error detecting anomalies:', error);
            throw error;
        }
    },

    // Get anomaly history
    async getAnomalyHistory(userId, limit = 100) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/anomalies/history/${userId}?limit=${limit}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching anomaly history:', error);
            throw error;
        }
    },

    // Get anomaly statistics
    async getAnomalyStats(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/anomalies/stats/${userId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching anomaly statistics:', error);
            throw error;
        }
    },

    // Update anomaly status (mark as resolved, false positive, etc.)
    async updateAnomalyStatus(anomalyId, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/anomalies/${anomalyId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating anomaly status:', error);
            throw error;
        }
    }
};