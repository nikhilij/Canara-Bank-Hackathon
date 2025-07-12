# Architecture Documentation

## Overview
TrustVault is a privacy-by-design data sharing platform for fintech, integrating advanced privacy, blockchain, ML anomaly detection, and compliance modules.

## System Architecture

### High-Level Architecture
- **Frontend**: React + Tailwind UI for consent management and user control
- **Backend**: Node.js/Express REST API, orchestrating privacy, blockchain, ML, and compliance
- **Privacy Engine**: Python microservice for tokenization and differential privacy
- **ML Service**: Python microservice for anomaly detection
- **Blockchain**: Hyperledger Fabric smart contracts for consent, audit, and data sharing
- **Database**: PostgreSQL for transactional and audit data
- **Compliance**: Automated reporting and geo-fencing

### Components

#### Frontend Layer
- Consent dashboard
- Real-time consent revocation
- Audit log viewer
- API integration

#### Backend Layer
- REST API endpoints (auth, consent, tokenization, audit, compliance)
- Business logic and orchestration
- Integration with privacy engine, ML, blockchain
- Data validation and rate limiting

#### Privacy Engine
- Tokenization (cryptographic hashing)
- Differential privacy (ε-differential privacy)
- Data anonymization

#### ML Service
- Anomaly detection (Isolation Forest)
- Real-time monitoring of access patterns

#### Blockchain Layer
- Smart contracts for consent lifecycle
- Audit trail and immutable logs
- Consent verification and revocation

#### Compliance Layer
- Geo-fenced storage
- Automated DPDP/GDPR reporting
- Data localization

## Technology Stack

### Frontend
- React
- Tailwind CSS

### Backend
- Node.js
- Express
- PostgreSQL

### Privacy & ML
- Python (Flask/FastAPI)
- Custom privacy/anomaly models

### Blockchain
- Hyperledger Fabric
- Solidity (optional for Ethereum)

### Infrastructure
- Docker
- CI/CD (GitHub Actions)
- Monitoring (Prometheus/Grafana)

## Deployment Architecture

### Development Environment
- Local Docker setup for all services
- Hot-reload for backend/frontend

### Production Environment
- Scalable containers
- Secure network segmentation
- Centralized logging and monitoring

## Security Considerations
- JWT authentication
- Role-based access control
- End-to-end encryption
- Hardware security modules
- Regulatory compliance (GDPR, DPDP, PCI DSS, ISO 27001)