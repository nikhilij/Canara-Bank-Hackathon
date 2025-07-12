# Authentication API

## Overview
This document describes the authentication endpoints for the Canara Bank API.

## Base URL
```
https://api.canarabank.com/v1
```

## Endpoints

### POST /auth/login
Authenticate a user and return an access token.

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "token": "string",
    "expires_in": 3600,
    "user": {
        "id": "string",
        "username": "string",
        "role": "string"
    }
}
```

### POST /auth/logout
Invalidate the current session token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
    "message": "Successfully logged out"
}
```

### POST /auth/refresh
Refresh an expired token.

**Request Body:**
```json
{
    "refresh_token": "string"
}
```

**Response:**
```json
{
    "token": "string",
    "expires_in": 3600
}
```

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Access denied |
| 429 | Too Many Requests - Rate limit exceeded |
