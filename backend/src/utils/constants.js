// Constants
// TODO: Define application constants
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    INTERNAL_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error'
};

const SUCCESS_MESSAGES = {
    USER_CREATED: 'User created successfully',
    LOGIN_SUCCESS: 'Login successful',
    DATA_FETCHED: 'Data fetched successfully',
    OPERATION_SUCCESS: 'Operation completed successfully'
};

const DATABASE = {
    CONNECTION_TIMEOUT: 30000,
    MAX_CONNECTIONS: 10
};

const JWT = {
    EXPIRES_IN: '24h',
    ALGORITHM: 'HS256'
};

module.exports = {
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    DATABASE,
    JWT
};