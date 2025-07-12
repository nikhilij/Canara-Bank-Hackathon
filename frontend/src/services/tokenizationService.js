// Tokenization service
// TODO: Implement tokenization API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const tokenizationService = {
    // Tokenize card details
    async tokenizeCard(cardData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tokenize/card`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData),
            });
            
            if (!response.ok) {
                throw new Error('Tokenization failed');
            }
            
            return await response.json();
        } catch (error) {
            throw new Error(`Tokenization error: ${error.message}`);
        }
    },

    // Detokenize card details
    async detokenizeCard(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/tokenize/detokenize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            
            if (!response.ok) {
                throw new Error('Detokenization failed');
            }
            
            return await response.json();
        } catch (error) {
            throw new Error(`Detokenization error: ${error.message}`);
        }
    },

    // Get tokenization status
    async getTokenStatus(tokenId) {
        try {
            const response = await fetch(`${API_BASE_URL}/tokenize/status/${tokenId}`);
            
            if (!response.ok) {
                throw new Error('Failed to get token status');
            }
            
            return await response.json();
        } catch (error) {
            throw new Error(`Token status error: ${error.message}`);
        }
    },

    // Delete token
    async deleteToken(tokenId) {
        try {
            const response = await fetch(`${API_BASE_URL}/tokenize/${tokenId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete token');
            }
            
            return await response.json();
        } catch (error) {
            throw new Error(`Delete token error: ${error.message}`);
        }
    }
};