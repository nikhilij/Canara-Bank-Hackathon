const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const consentController = require('../controllers/consentController');
const auditController = require('../controllers/auditController');
const userController = require('../controllers/userController');

// Import middleware
const { authenticateJWT } = require('../middleware/auth');

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// Consent Routes
router.get('/consents', authenticateJWT, consentController.getUserConsents);
router.get('/consents/:id', authenticateJWT, consentController.getConsentDetails);
router.post('/consents', authenticateJWT, consentController.grantConsent);
router.post('/consents/:id/revoke', authenticateJWT, consentController.revokeConsent);
router.get('/consents/:id/audit-trail', authenticateJWT, consentController.getConsentAuditTrail);
router.get('/consents/categories', authenticateJWT, consentController.getConsentCategories);
router.get('/consents/purposes', authenticateJWT, consentController.getConsentPurposes);

// Audit Routes
router.get('/audit-logs', authenticateJWT, auditController.getUserAuditLogs);
router.get('/audit-logs/summary', authenticateJWT, auditController.getAuditSummary);

// Data Access Routes
router.get('/data-access', authenticateJWT, auditController.getDataAccessLogs);

// User Profile Routes
router.get('/user/profile', authenticateJWT, userController.getProfile);
router.put('/user/profile', authenticateJWT, userController.updateProfile);
router.put('/user/password', authenticateJWT, userController.updatePassword);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
