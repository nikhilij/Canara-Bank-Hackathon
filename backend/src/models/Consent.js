const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./User');

const Consent = sequelize.define('Consent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  dataRecipient: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Organization or entity receiving the data',
  },
  dataCategory: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Category of data being shared (e.g., FINANCIAL, PERSONAL)',
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Purpose of data sharing (e.g., ANALYTICS, MARKETING)',
  },
  status: {
    type: DataTypes.ENUM('GRANTED', 'REVOKED', 'EXPIRED'),
    allowNull: false,
    defaultValue: 'GRANTED',
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  revocationReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  blockchainReference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Reference to blockchain record for verification',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const ConsentAudit = sequelize.define('ConsentAudit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  consentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Consent,
      key: 'id',
    },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of action (e.g., GRANTED, REVOKED, ACCESSED, VERIFIED)',
  },
  actor: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'User ID or system identifier that performed the action',
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional information about the action',
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Define relationships
Consent.hasMany(ConsentAudit, { foreignKey: 'consentId' });
ConsentAudit.belongsTo(Consent, { foreignKey: 'consentId' });
User.hasMany(Consent, { foreignKey: 'userId' });
Consent.belongsTo(User, { foreignKey: 'userId' });

module.exports = { Consent, ConsentAudit };
