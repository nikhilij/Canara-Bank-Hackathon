# Consent API Documentation

## Overview
The Consent API manages user consent for data sharing and processing within the banking application.

## Endpoints

### Create Consent
```
POST /api/consent
```

**Request Body:**
```json
{
    "userId": "string",
    "consentType": "string",
    "description": "string",
    "expiryDate": "string (ISO 8601)"
}
```

**Response:**
```json
{
    "consentId": "string",
    "status": "active",
    "createdAt": "string (ISO 8601)"
}
```

### Get Consent
```
GET /api/consent/{consentId}
```

**Response:**
```json
{
    "consentId": "string",
    "userId": "string",
    "consentType": "string",
    "description": "string",
    "status": "active|revoked|expired",
    "createdAt": "string (ISO 8601)",
    "expiryDate": "string (ISO 8601)"
}
```

### Revoke Consent
```
DELETE /api/consent/{consentId}
```

**Response:**
```json
{
    "message": "Consent revoked successfully",
    "revokedAt": "string (ISO 8601)"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error