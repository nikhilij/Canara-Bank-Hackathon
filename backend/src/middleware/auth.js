const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const config = require('../config');

// Authentication middleware for JWT
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract the token from the Bearer scheme
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based access control middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
    }
    next();
  };
};

// Rate limiting middleware to prevent abuse
exports.rateLimit = (req, res, next) => {
  // In a real implementation, this would use Redis or similar
  // to track request counts per IP or user
  // For now, just pass through
  next();
};

// Logging middleware for audit trail
exports.auditLogger = (req, res, next) => {
  const start = Date.now();
  
  // Add a listener for when the response is completed
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      userId: req.user?.id || 'anonymous',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      statusCode: res.statusCode,
      responseTime: duration
    };
    
    // In production, you would save this to a database or logging service
    console.log('API Access Log:', log);
  });
  
  next();
};

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Don't expose sensitive error details in production
  const isProd = process.env.NODE_ENV === 'production';
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: 'error',
    message: isProd ? 'Internal Server Error' : err.message,
    ...(isProd ? {} : { stack: err.stack })
  });
};
