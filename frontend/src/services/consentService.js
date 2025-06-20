import api from './api';

/**
 * Service for managing user consent operations
 */
const consentService = {
  /**
   * Get all consents for the current user
   * @returns {Promise} API response with consents
   */
  getUserConsents: async () => {
    const response = await api.get('/consents');
    return response.data;
  },
  
  /**
   * Get detailed information about a specific consent
   * @param {string} consentId - The ID of the consent
   * @returns {Promise} API response with consent details
   */
  getConsentDetails: async (consentId) => {
    const response = await api.get(`/consents/${consentId}`);
    return response.data;
  },
  
  /**
   * Grant new consent for data sharing
   * @param {Object} consentData - Consent data object
   * @param {string} consentData.dataRecipient - Organization receiving data
   * @param {string} consentData.dataCategory - Category of data to share
   * @param {string} consentData.purpose - Purpose of data sharing
   * @param {string} consentData.expiryDate - Expiration date for consent
   * @returns {Promise} API response with created consent
   */
  grantConsent: async (consentData) => {
    const response = await api.post('/consents', consentData);
    return response.data;
  },
  
  /**
   * Revoke a previously granted consent
   * @param {string} consentId - The ID of the consent to revoke
   * @param {string} reason - Reason for revocation
   * @returns {Promise} API response with revocation result
   */
  revokeConsent: async (consentId, reason) => {
    const response = await api.post(`/consents/${consentId}/revoke`, { reason });
    return response.data;
  },
  
  /**
   * Get all audit logs for a specific consent
   * @param {string} consentId - The ID of the consent
   * @returns {Promise} API response with audit logs
   */
  getConsentAuditTrail: async (consentId) => {
    const response = await api.get(`/consents/${consentId}/audit-trail`);
    return response.data;
  },
  
  /**
   * Get all consent categories available in the system
   * @returns {Promise} API response with consent categories
   */
  getConsentCategories: async () => {
    const response = await api.get('/consents/categories');
    return response.data;
  },
  
  /**
   * Get all consent purposes available in the system
   * @returns {Promise} API response with consent purposes
   */
  getConsentPurposes: async () => {
    const response = await api.get('/consents/purposes');
    return response.data;
  }
};

export default consentService;
