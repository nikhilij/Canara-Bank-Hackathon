require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'trustvault',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true'
  },
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Client app URL (for email links, etc.)
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // External service URLs
  services: {
    tokenization: process.env.TOKENIZATION_API_URL || 'http://localhost:5001',
    anomalyDetection: process.env.ANOMALY_DETECTION_API_URL || 'http://localhost:5002',
    blockchain: process.env.BLOCKCHAIN_API_URL || 'http://localhost:8545'
  },
  
  // Blockchain configuration
  blockchain: {
    networkId: process.env.BLOCKCHAIN_NETWORK_ID || 'trustvault-network',
    channelName: process.env.BLOCKCHAIN_CHANNEL_NAME || 'trustvault-channel',
    chaincodeName: process.env.BLOCKCHAIN_CHAINCODE_NAME || 'consent-agreement',
    walletPath: process.env.BLOCKCHAIN_WALLET_PATH || './wallet',
    userId: process.env.BLOCKCHAIN_USER_ID || 'admin'
  },
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'user@example.com',
      pass: process.env.EMAIL_PASS || 'password'
    },
    from: process.env.EMAIL_FROM || 'TrustVault <no-reply@trustvault.com>'
  },
  
  // Privacy configuration
  privacy: {
    differentialPrivacyEpsilon: parseFloat(process.env.DIFFERENTIAL_PRIVACY_EPSILON) || 0.1,
    tokenizationSecret: process.env.TOKENIZATION_SECRET_KEY || 'change-this-in-production'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100 // Limit each IP to 100 requests per windowMs
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  
  // Geolocation service for geo-fencing
  geolocation: {
    apiKey: process.env.GEOLOCATION_API_KEY || '',
    restrictedCountries: (process.env.RESTRICTED_COUNTRIES || 'RU,CN,NK').split(',')
  }
};
