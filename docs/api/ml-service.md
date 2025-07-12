# ML Service API Documentation

## Overview
The ML Service provides endpoints for anomaly detection, credit scoring, and risk analysis. All endpoints require token-based authentication.

## Authentication
Include the following header in all requests:
```
Authorization: Bearer <API_TOKEN>
```

## Endpoints

### Train Anomaly Model
```
POST /train
Headers: Authorization
Body:
{
  "features": [[...], [...], ...]
}
Response:
{
  "status": "success",
  "message": "Model trained successfully"
}
```

### Detect Anomalies
```
POST /detect
Headers: Authorization
Body:
{
  "features": [[...], [...], ...]
}
Response:
{
  "status": "success",
  "results": [ { "index": 0, "is_anomaly": true, "anomaly_score": -0.5 }, ... ],
  "summary": { "total_records": 100, "anomalies_detected": 5, "anomaly_rate": 0.05 }
}
```

### Credit Score
```
POST /credit-score
Headers: Authorization
Body:
{
  "features": [ ... ]
}
Response:
{
  "credit_score": 750,
  "status": "success"
}
```

### Risk Analysis
```
POST /risk-analysis
Headers: Authorization
Body:
{
  "features": [ ... ]
}
Response:
{
  "risk_level": "low",
  "status": "success"
}
```

### Health Check
```
GET /health
Response:
{
  "status": "healthy"
}
```
