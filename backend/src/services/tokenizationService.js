const axios = require('axios');
const crypto = require('crypto');
const config = require('../config');

class TokenizationService {
  constructor() {
    this.apiUrl = config.services.tokenization;
    this.secret = config.privacy.tokenizationSecret;
    this.headers = {
      'Content-Type': 'application/json'
    };
    
    console.log('Tokenization service initialized');
  }
  
  /**
   * Tokenize sensitive data
   * @param {string} data - The sensitive data to tokenize
   * @param {Object} context - Optional context for the tokenization
   * @returns {Promise<string>} - Tokenized value
   */
  async tokenize(data, context = {}) {
    try {
      // If the privacy engine is available, use it
      try {
        const response = await axios.post(`${this.apiUrl}/tokenize`, {
          value: data,
          context
        }, {
          headers: this.headers
        });
        
        return response.data.token;
      } catch (apiError) {
        console.warn('Privacy engine API unreachable, falling back to local tokenization:', apiError.message);
        
        // Fall back to local tokenization method
        return this._localTokenize(data, context);
      }
    } catch (error) {
      console.error('Tokenization error:', error);
      throw new Error('Failed to tokenize data');
    }
  }
  
  /**
   * Verify if a token matches the original data
   * @param {string} token - The token to verify
   * @param {string} originalData - The original data
   * @param {Object} context - Optional context used during tokenization
   * @returns {Promise<boolean>} - True if token is valid
   */
  async verifyToken(token, originalData, context = {}) {
    try {
      // If the privacy engine is available, use it
      try {
        const response = await axios.post(`${this.apiUrl}/verify`, {
          token,
          originalValue: originalData,
          context
        }, {
          headers: this.headers
        });
        
        return response.data.valid;
      } catch (apiError) {
        console.warn('Privacy engine API unreachable, falling back to local verification:', apiError.message);
        
        // Fall back to local verification
        const generatedToken = this._localTokenize(originalData, context);
        return token === generatedToken;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Failed to verify token');
    }
  }
  
  /**
   * Apply differential privacy to a dataset
   * @param {Array} dataset - Dataset to anonymize
   * @param {number} epsilon - Privacy parameter (lower = more privacy)
   * @returns {Promise<Array>} - Anonymized dataset
   */
  async applyDifferentialPrivacy(dataset, epsilon = config.privacy.differentialPrivacyEpsilon) {
    try {
      // In a real implementation, this would call the privacy engine API
      // For the prototype, we'll simulate the effect of differential privacy
      
      console.log(`Applying differential privacy with epsilon ${epsilon}`);
      
      // Simple noise addition simulation
      return dataset.map(item => {
        if (typeof item === 'number') {
          // Add Laplace noise scaled to epsilon
          const noise = this._laplacian(0, 1/epsilon);
          return item + noise;
        }
        return item;
      });
    } catch (error) {
      console.error('Differential privacy application error:', error);
      throw new Error('Failed to apply differential privacy');
    }
  }
  
  /**
   * Local implementation of tokenization using HMAC-SHA256
   * @private
   * @param {string} data - Data to tokenize
   * @param {Object} context - Optional context
   * @returns {string} - Tokenized value
   */
  _localTokenize(data, context = {}) {
    if (!data) return null;
    
    const contextString = Object.keys(context).length > 0 ? 
      JSON.stringify(context, Object.keys(context).sort()) : '';
    
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(data);
    
    if (contextString) {
      hmac.update(contextString);
    }
    
    return hmac.digest('base64');
  }
  
  /**
   * Generate Laplacian noise for differential privacy
   * @private
   * @param {number} mu - Mean (usually 0)
   * @param {number} b - Scale parameter
   * @returns {number} - Random noise
   */
  _laplacian(mu, b) {
    const u = Math.random() - 0.5;
    return mu - b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }
}

module.exports = { TokenizationService };
