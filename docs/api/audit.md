# Audit API Documentation

## Overview
The Audit API provides endpoints for retrieving audit logs, summaries, and exporting audit data for compliance and monitoring.

## Endpoints

### Get Audit Logs
```
GET /api/audit-logs
```
**Response:**
```json
{
  "auditLogs": [ ... ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

### Get Audit Summary
```
GET /api/audit-logs/summary
```
**Response:**
```json
{
  "summary": { ... }
}
```

### Export Audit Logs
```
GET /api/audit-logs/export
```
**Response:**
- CSV or JSON file download

## Status Codes
- `200` - Success
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
