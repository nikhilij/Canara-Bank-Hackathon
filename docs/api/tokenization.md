# Tokenization API Documentation

## Overview
The Tokenization API securely replaces sensitive data with cryptographic tokens using the privacy engine.

## Endpoints

### Tokenize Data
```
POST /api/tokenize
```
**Request Body:**
```json
{
  "data": "string",
  "dataType": "string",
  "purpose": "string",
  "retention": "string"
}
```
**Response:**
```json
{
  "token": "string",
  "expires": "ISO 8601 date",
  "consentId": "string"
}
```

### Detokenize Data
```
GET /api/token/:token
```
**Response:**
```json
{
  "token": "string",
  "data": "string"
}
```

### Validate Token
```
GET /api/token/:token/validate
```
**Response:**
```json
{
  "valid": true
}
```

### Delete Token
```
DELETE /api/token/:token
```
**Response:**
```json
{
  "message": "Token deleted successfully"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
