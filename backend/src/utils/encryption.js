const crypto = require('crypto');

// Encryption utilities
// TODO: Implement encryption/decryption functions
const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);

/**
 * Encrypts a string using AES-256-GCM
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text with IV and auth tag
 */
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, secretKey);
    cipher.setAAD(Buffer.from('additional-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts a string using AES-256-GCM
 * @param {string} encryptedText - Encrypted text with IV and auth tag
 * @returns {string} - Decrypted text
 */
function decrypt(encryptedText) {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(algorithm, secretKey);
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

/**
 * Generates a secure hash using SHA-256
 * @param {string} text - Text to hash
 * @returns {string} - Hash in hex format
 */
function hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports = {
    encrypt,
    decrypt,
    hash
};