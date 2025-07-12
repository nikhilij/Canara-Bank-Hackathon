const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const consentController = require('../controllers/consentController');
const auditController = require('../controllers/auditController');
const userController = require('../controllers/userController');
const tokenizationController = require('../controllers/tokenizationController');

// Import middleware
const { authenticateJWT, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { rateLimit } = require('../middleware/rateLimit');

// API versioning
const API_VERSION = '/api/v1';

// Auth Routes with rate limiting
router.post(`${API_VERSION}/auth/login`, rateLimit.auth, validateRequest('login'), authController.login);
router.post(`${API_VERSION}/auth/register`, rateLimit.auth, validateRequest('register'), authController.register);
router.post(`${API_VERSION}/auth/forgot-password`, rateLimit.auth, validateRequest('forgotPassword'), authController.forgotPassword);
router.post(`${API_VERSION}/auth/reset-password`, rateLimit.auth, validateRequest('resetPassword'), authController.resetPassword);
router.post(`${API_VERSION}/auth/refresh`, rateLimit.auth, authController.refreshToken);
router.post(`${API_VERSION}/auth/logout`, authenticateJWT, authController.logout);

// Tokenization Endpoints (from README)
router.post(`${API_VERSION}/tokenize`, authenticateJWT, tokenizationController.tokenizeCard); // Tokenize sensitive data
router.get(`${API_VERSION}/token/:token`, authenticateJWT, tokenizationController.detokenizeCard); // Detokenize data
router.get(`${API_VERSION}/token/:token/validate`, authenticateJWT, tokenizationController.validateToken); // Validate token
router.delete(`${API_VERSION}/token/:token`, authenticateJWT, tokenizationController.deleteToken); // Delete token

// Consent Routes with pagination and filtering
router.get(`${API_VERSION}/consents`, authenticateJWT, consentController.getUserConsents);
router.get(`${API_VERSION}/consents/:id`, authenticateJWT, validateRequest('getConsent'), consentController.getConsentDetails);
router.post(`${API_VERSION}/consents`, authenticateJWT, validateRequest('grantConsent'), consentController.grantConsent);
router.patch(`${API_VERSION}/consents/:id/revoke`, authenticateJWT, validateRequest('revokeConsent'), consentController.revokeConsent);
router.post(`${API_VERSION}/revoke`, authenticateJWT, consentController.revokeConsent); // Revoke consent (README endpoint)
router.get(`${API_VERSION}/consents/:id/audit-trail`, authenticateJWT, consentController.getConsentAuditTrail);
router.get(`${API_VERSION}/consents/categories`, authenticateJWT, consentController.getConsentCategories);
router.get(`${API_VERSION}/consents/purposes`, authenticateJWT, consentController.getConsentPurposes);

// Bulk consent operations
router.post(`${API_VERSION}/consents/bulk/grant`, authenticateJWT, validateRequest('bulkGrant'), consentController.bulkGrantConsents);
router.patch(`${API_VERSION}/consents/bulk/revoke`, authenticateJWT, validateRequest('bulkRevoke'), consentController.bulkRevokeConsents);

// Audit Routes with advanced filtering
router.get(`${API_VERSION}/audit-logs`, authenticateJWT, auditController.getUserAuditLogs); // Fetch audit trail (README endpoint)
router.get(`${API_VERSION}/audit-logs/summary`, authenticateJWT, auditController.getAuditSummary);
router.get(`${API_VERSION}/audit-logs/export`, authenticateJWT, auditController.exportAuditLogs);

// Data Access Routes
router.get(`${API_VERSION}/data-access`, authenticateJWT, auditController.getDataAccessLogs);
router.get(`${API_VERSION}/data-access/summary`, authenticateJWT, auditController.getDataAccessSummary);

// Data Sharing Endpoint (README)
router.post(`${API_VERSION}/share-data`, authenticateJWT, auditController.shareData); // Execute data sharing

// User Profile Routes
router.get(`${API_VERSION}/user/profile`, authenticateJWT, userController.getProfile);
router.put(`${API_VERSION}/user/profile`, authenticateJWT, validateRequest('updateProfile'), userController.updateProfile);
router.put(`${API_VERSION}/user/password`, authenticateJWT, validateRequest('updatePassword'), userController.updatePassword);
router.delete(`${API_VERSION}/user/account`, authenticateJWT, userController.deleteAccount);

// Admin Routes (if applicable)
router.get(`${API_VERSION}/admin/users`, authenticateJWT, authorize('admin'), userController.getAllUsers);
router.get(`${API_VERSION}/admin/consents`, authenticateJWT, authorize('admin'), consentController.getAllConsents);
router.get(`${API_VERSION}/admin/audit-logs`, authenticateJWT, authorize('admin'), auditController.getAllAuditLogs);

// Health and monitoring endpoints
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0'
  });
});

router.get('/metrics', authenticateJWT, authorize('admin'), auditController.getMetrics);

module.exports = router;
