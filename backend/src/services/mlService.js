const axios = require('axios');

// ML service integration
// TODO: Implement ML service communication
class MLService {
    constructor() {
        this.baseURL = process.env.ML_SERVICE_URL || 'http://localhost:5000';
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async predictCreditScore(userData) {
        try {
            const response = await this.client.post('/predict/credit-score', userData);
            return response.data;
        } catch (error) {
            throw new Error(`ML Service Error: ${error.message}`);
        }
    }

    async detectFraud(transactionData) {
        try {
            const response = await this.client.post('/detect/fraud', transactionData);
            return response.data;
        } catch (error) {
            throw new Error(`Fraud Detection Error: ${error.message}`);
        }
    }

    async getLoanRecommendations(customerProfile) {
        try {
            const response = await this.client.post('/recommend/loans', customerProfile);
            return response.data;
        } catch (error) {
            throw new Error(`Loan Recommendation Error: ${error.message}`);
        }
    }

    async analyzeRiskProfile(financialData) {
        try {
            const response = await this.client.post('/analyze/risk', financialData);
            return response.data;
        } catch (error) {
            throw new Error(`Risk Analysis Error: ${error.message}`);
        }
    }
}

module.exports = new MLService();