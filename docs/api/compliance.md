# Compliance API Documentation

## Overview
The Compliance API provides endpoints for generating compliance reports, checking transaction compliance, and managing compliance rules.

## Endpoints

### Generate Compliance Report
```
GET /api/compliance/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
**Response:**
```json
{
  "period": { "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" },
  "totalTransactions": 1000,
  "flaggedCount": 10,
  "complianceRate": "99.0",
  "violationSummary": [ ... ],
  "flaggedTransactions": [ ... ]
}
```

### Check Transaction Compliance
```
POST /api/compliance/check
```
**Request Body:**
```json
{
  "transactionData": { ... }
}
```
**Response:**
```json
{
  "isCompliant": true,
  "violations": []
}
```

### Manage Compliance Rules
```
GET /api/compliance/rules
PATCH /api/compliance/rules/:ruleId
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
