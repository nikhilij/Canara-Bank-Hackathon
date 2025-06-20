/**
 * TrustVault Smart Contract for Data Sharing Agreements
 * 
 * This chaincode implements privacy-focused data sharing agreements
 * with user consent revocation capabilities and audit trail.
 */

'use strict';

const { Contract } = require('fabric-contract-api');

// Consent states
const CONSENT_STATES = {
  GRANTED: 'GRANTED',
  REVOKED: 'REVOKED', 
  EXPIRED: 'EXPIRED'
};

// Data sharing purpose categories
const PURPOSE_CATEGORIES = [
  'ANALYTICS', 
  'MARKETING',
  'SERVICE_IMPROVEMENT', 
  'RESEARCH',
  'THIRD_PARTY'
];

class DataSharingAgreement extends Contract {
  
  /**
   * Initialize the ledger with default entries
   * @param {Context} ctx the transaction context
   */
  async initLedger(ctx) {
    console.info('============= START : Initialize Ledger ===========');
    console.info('============= END : Initialize Ledger ===========');
  }
  
  /**
   * Record a new consent for data sharing
   * @param {Context} ctx the transaction context
   * @param {String} consentId unique identifier for the consent record
   * @param {String} userId user identifier
   * @param {String} dataRecipient organization receiving the data
   * @param {String} dataCategory category of data being shared (e.g., 'FINANCIAL')
   * @param {String} purpose purpose of data sharing (must be in PURPOSE_CATEGORIES)
   * @param {String} expiryDate ISO date string for consent expiry
   */
  async recordConsent(ctx, consentId, userId, dataRecipient, dataCategory, purpose, expiryDate) {
    console.info('============= START : Record new consent ===========');
    
    // Validate purpose
    if (!PURPOSE_CATEGORIES.includes(purpose)) {
      throw new Error(`Purpose must be one of: ${PURPOSE_CATEGORIES.join(', ')}`);
    }
    
    // Check if consent already exists
    const consentAsBytes = await ctx.stub.getState(consentId);
    if (consentAsBytes && consentAsBytes.length > 0) {
      throw new Error(`Consent ${consentId} already exists`);
    }
    
    // Create consent object with audit metadata
    const consent = {
      docType: 'consent',
      consentId,
      userId,
      dataRecipient,
      dataCategory,
      purpose,
      status: CONSENT_STATES.GRANTED,
      expiryDate,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      auditTrail: [{
        action: 'CREATED',
        timestamp: new Date().toISOString(),
        actor: ctx.clientIdentity.getID()
      }]
    };
    
    await ctx.stub.putState(consentId, Buffer.from(JSON.stringify(consent)));
    console.info('============= END : Record new consent ===========');
    return JSON.stringify(consent);
  }
  
  /**
   * Revoke a previously granted consent
   * @param {Context} ctx the transaction context
   * @param {String} consentId unique identifier for the consent record
   * @param {String} userId user identifier (for verification)
   * @param {String} reason reason for revocation
   */
  async revokeConsent(ctx, consentId, userId, reason) {
    console.info('============= START : Revoke consent ===========');
    
    // Get the consent from chaincode state
    const consentAsBytes = await ctx.stub.getState(consentId);
    if (!consentAsBytes || consentAsBytes.length === 0) {
      throw new Error(`Consent ${consentId} does not exist`);
    }
    
    const consent = JSON.parse(consentAsBytes.toString());
    
    // Verify the user identity
    if (consent.userId !== userId) {
      throw new Error('User ID does not match consent record');
    }
    
    // Check if already revoked
    if (consent.status === CONSENT_STATES.REVOKED) {
      throw new Error('Consent already revoked');
    }
    
    // Update consent status
    consent.status = CONSENT_STATES.REVOKED;
    consent.lastModified = new Date().toISOString();
    consent.revocationReason = reason;
    consent.auditTrail.push({
      action: 'REVOKED',
      timestamp: new Date().toISOString(),
      actor: ctx.clientIdentity.getID(),
      reason
    });
    
    await ctx.stub.putState(consentId, Buffer.from(JSON.stringify(consent)));
    console.info('============= END : Revoke consent ===========');
    return JSON.stringify(consent);
  }
  
  /**
   * Verify if consent is valid for data sharing
   * @param {Context} ctx the transaction context
   * @param {String} consentId unique identifier for the consent record
   * @param {String} dataRecipient organization attempting to access data
   * @param {String} purpose purpose of data access
   */
  async verifyConsent(ctx, consentId, dataRecipient, purpose) {
    console.info('============= START : Verify consent ===========');
    
    // Get the consent from chaincode state
    const consentAsBytes = await ctx.stub.getState(consentId);
    if (!consentAsBytes || consentAsBytes.length === 0) {
      throw new Error(`Consent ${consentId} does not exist`);
    }
    
    const consent = JSON.parse(consentAsBytes.toString());
    
    // Record verification attempt in audit trail
    consent.auditTrail.push({
      action: 'VERIFICATION_ATTEMPT',
      timestamp: new Date().toISOString(),
      actor: ctx.clientIdentity.getID(),
      dataRecipient,
      purpose
    });
    
    await ctx.stub.putState(consentId, Buffer.from(JSON.stringify(consent)));
    
    // Check if consent is valid
    const now = new Date();
    const expiryDate = new Date(consent.expiryDate);
    const isExpired = expiryDate < now;
    
    if (isExpired && consent.status !== CONSENT_STATES.EXPIRED) {
      // Update to expired if not already
      consent.status = CONSENT_STATES.EXPIRED;
      consent.lastModified = new Date().toISOString();
      consent.auditTrail.push({
        action: 'EXPIRED',
        timestamp: new Date().toISOString(),
        actor: 'SYSTEM'
      });
      await ctx.stub.putState(consentId, Buffer.from(JSON.stringify(consent)));
    }
    
    const isValid = 
      consent.status === CONSENT_STATES.GRANTED && 
      !isExpired && 
      consent.dataRecipient === dataRecipient && 
      consent.purpose === purpose;
    
    const result = {
      consentId,
      userId: consent.userId,
      isValid,
      status: consent.status,
      expiryDate: consent.expiryDate,
      verificationTime: new Date().toISOString()
    };
    
    console.info('============= END : Verify consent ===========');
    return JSON.stringify(result);
  }
  
  /**
   * Get the audit trail for a consent record
   * @param {Context} ctx the transaction context
   * @param {String} consentId unique identifier for the consent record
   */
  async getAuditTrail(ctx, consentId) {
    console.info('============= START : Get audit trail ===========');
    
    // Get the consent from chaincode state
    const consentAsBytes = await ctx.stub.getState(consentId);
    if (!consentAsBytes || consentAsBytes.length === 0) {
      throw new Error(`Consent ${consentId} does not exist`);
    }
    
    const consent = JSON.parse(consentAsBytes.toString());
    
    // Record audit access in the trail
    consent.auditTrail.push({
      action: 'AUDIT_ACCESS',
      timestamp: new Date().toISOString(),
      actor: ctx.clientIdentity.getID()
    });
    
    await ctx.stub.putState(consentId, Buffer.from(JSON.stringify(consent)));
    
    const result = {
      consentId,
      userId: consent.userId,
      dataRecipient: consent.dataRecipient,
      status: consent.status,
      auditTrail: consent.auditTrail
    };
    
    console.info('============= END : Get audit trail ===========');
    return JSON.stringify(result);
  }
  
  /**
   * Query consents by user ID
   * @param {Context} ctx the transaction context
   * @param {String} userId user identifier
   */
  async queryConsentsByUser(ctx, userId) {
    console.info('============= START : Query consents by user ===========');
    
    const queryString = {
      selector: {
        docType: 'consent',
        userId
      }
    };
    
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    const results = await this._getAllResults(iterator);
    
    console.info('============= END : Query consents by user ===========');
    return JSON.stringify(results);
  }
  
  /**
   * Helper function to retrieve all query results
   * @param {Object} iterator result iterator
   */
  async _getAllResults(iterator) {
    const results = [];
    let result = await iterator.next();
    
    while (!result.done) {
      const item = JSON.parse(result.value.value.toString('utf8'));
      results.push(item);
      result = await iterator.next();
    }
    
    await iterator.close();
    return results;
  }
}

module.exports = DataSharingAgreement;
