const { Consent, ConsentAudit } = require('../models/Consent');
const { BlockchainService } = require('../services/blockchainService');
const { TokenizationService } = require('../services/tokenizationService');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Initialize services
const blockchainService = new BlockchainService();
const tokenizationService = new TokenizationService();

/**
 * Get all consents for the current user
 * @route GET /api/consents
 */
exports.getUserConsents = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const consents = await Consent.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    
    return res.json(consents);
  } catch (error) {
    console.error('Error fetching user consents:', error);
    return res.status(500).json({ message: 'Failed to retrieve consents' });
  }
};

/**
 * Get details for a specific consent
 * @route GET /api/consents/:id
 */
exports.getConsentDetails = async (req, res) => {
  try {
    const consentId = req.params.id;
    const userId = req.user.id;
    
    const consent = await Consent.findOne({
      where: {
        id: consentId,
        userId
      }
    });
    
    if (!consent) {
      return res.status(404).json({ message: 'Consent not found' });
    }
    
    return res.json(consent);
  } catch (error) {
    console.error('Error fetching consent details:', error);
    return res.status(500).json({ message: 'Failed to retrieve consent details' });
  }
};

/**
 * Grant new consent for data sharing
 * @route POST /api/consents
 */
exports.grantConsent = async (req, res) => {
  try {
    const { dataRecipient, dataCategory, purpose, expiryDate } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!dataRecipient || !dataCategory || !purpose || !expiryDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate expiry date is in the future
    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({ message: 'Expiry date must be in the future' });
    }
    
    // Generate consent ID
    const consentId = crypto.randomUUID();
    
    // Create consent in database
    const consent = await Consent.create({
      id: consentId,
      userId,
      dataRecipient,
      dataCategory,
      purpose,
      status: 'GRANTED',
      expiryDate,
    });
    
    // Store consent in blockchain for immutability
    try {
      await blockchainService.recordConsent(
        consentId,
        userId,
        dataRecipient,
        dataCategory,
        purpose,
        expiryDate
      );
    } catch (blockchainError) {
      console.error('Blockchain recording failed:', blockchainError);
      // Continue even if blockchain fails - retry mechanism should be implemented
    }
    
    // Create audit log
    await ConsentAudit.create({
      consentId: consent.id,
      action: 'GRANTED',
      actor: userId,
      details: 'Consent granted by user',
    });
    
    return res.status(201).json(consent);
  } catch (error) {
    console.error('Error granting consent:', error);
    return res.status(500).json({ message: 'Failed to grant consent' });
  }
};

/**
 * Revoke an existing consent
 * @route POST /api/consents/:id/revoke
 */
exports.revokeConsent = async (req, res) => {
  try {
    const consentId = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;
    
    // Find consent
    const consent = await Consent.findOne({
      where: {
        id: consentId,
        userId
      }
    });
    
    if (!consent) {
      return res.status(404).json({ message: 'Consent not found' });
    }
    
    if (consent.status !== 'GRANTED') {
      return res.status(400).json({ message: 'Only active consents can be revoked' });
    }
    
    // Update consent status
    consent.status = 'REVOKED';
    consent.revocationReason = reason || 'User initiated revocation';
    await consent.save();
    
    // Record in blockchain
    try {
      await blockchainService.revokeConsent(consentId, userId, reason);
    } catch (blockchainError) {
      console.error('Blockchain revocation failed:', blockchainError);
      // Continue even if blockchain fails
    }
    
    // Create audit log
    await ConsentAudit.create({
      consentId: consent.id,
      action: 'REVOKED',
      actor: userId,
      details: `Consent revoked. Reason: ${reason || 'Not provided'}`,
    });
    
    return res.json({
      message: 'Consent successfully revoked',
      consent
    });
  } catch (error) {
    console.error('Error revoking consent:', error);
    return res.status(500).json({ message: 'Failed to revoke consent' });
  }
};

/**
 * Get audit trail for a specific consent
 * @route GET /api/consents/:id/audit-trail
 */
exports.getConsentAuditTrail = async (req, res) => {
  try {
    const consentId = req.params.id;
    const userId = req.user.id;
    
    // Verify consent belongs to user
    const consent = await Consent.findOne({
      where: {
        id: consentId,
        userId
      }
    });
    
    if (!consent) {
      return res.status(404).json({ message: 'Consent not found' });
    }
    
    // Get audit trail from both database and blockchain
    const dbAuditTrail = await ConsentAudit.findAll({
      where: { consentId },
      order: [['createdAt', 'DESC']]
    });
    
    // Get blockchain audit trail
    let blockchainAuditTrail = [];
    try {
      blockchainAuditTrail = await blockchainService.getAuditTrail(consentId);
    } catch (blockchainError) {
      console.error('Error fetching blockchain audit trail:', blockchainError);
      // Continue with DB audit trail only
    }
    
    // Combine and format audit trail
    const auditTrail = {
      consentId,
      dbRecords: dbAuditTrail,
      blockchainRecords: blockchainAuditTrail
    };
    
    return res.json(auditTrail);
  } catch (error) {
    console.error('Error fetching consent audit trail:', error);
    return res.status(500).json({ message: 'Failed to retrieve audit trail' });
  }
};

/**
 * Get all available consent categories
 * @route GET /api/consents/categories
 */
exports.getConsentCategories = async (req, res) => {
  try {
    // These would typically come from a database table
    const categories = [
      { id: 'FINANCIAL', name: 'Financial Data', description: 'Bank account, transaction history, credit score' },
      { id: 'PERSONAL', name: 'Personal Information', description: 'Name, address, contact information' },
      { id: 'BIOMETRIC', name: 'Biometric Data', description: 'Fingerprints, facial recognition, voice patterns' },
      { id: 'LOCATION', name: 'Location Data', description: 'GPS coordinates, location history' },
      { id: 'BEHAVIORAL', name: 'Behavioral Data', description: 'App usage patterns, preferences' }
    ];
    
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching consent categories:', error);
    return res.status(500).json({ message: 'Failed to retrieve consent categories' });
  }
};

/**
 * Get all available consent purposes
 * @route GET /api/consents/purposes
 */
exports.getConsentPurposes = async (req, res) => {
  try {
    // These would typically come from a database table
    const purposes = [
      { id: 'ANALYTICS', name: 'Analytics', description: 'Data analysis for improving services' },
      { id: 'MARKETING', name: 'Marketing', description: 'Promotions and advertisements' },
      { id: 'SERVICE_IMPROVEMENT', name: 'Service Improvement', description: 'Enhancing product quality and features' },
      { id: 'RESEARCH', name: 'Research', description: 'Scientific or market research' },
      { id: 'THIRD_PARTY', name: 'Third Party Sharing', description: 'Sharing with partner organizations' }
    ];
    
    return res.json(purposes);
  } catch (error) {
    console.error('Error fetching consent purposes:', error);
    return res.status(500).json({ message: 'Failed to retrieve consent purposes' });
  }
};
