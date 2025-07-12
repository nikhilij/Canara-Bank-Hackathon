# Developer Documentation

## Overview
TrustVault is a modular privacy-first data sharing platform for fintech. This guide covers setup, development, API usage, and contribution.

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python 3.8+
- Docker
- Git
- VS Code (recommended)

### Installation
```bash
git clone <repository-url>
cd Canara-Bank-Hackathon
```

### Service Setup
- Backend: `cd backend && npm install`
- Frontend: `cd frontend && npm install`
- Privacy Engine: `cd privacy-engine && pip install -r requirements.txt`
- ML Service: `cd ml-service && pip install -r requirements.txt`

### Running Services
```bash
# Backend
npm run dev
# Frontend
npm run dev
# Privacy Engine
python tokenizer.py
# ML Service
python detector.py
```

## Project Structure
```
├── backend/
├── frontend/
├── privacy-engine/
├── ml-service/
├── blockchain/
├── config/
├── docs/
├── tests/
```

## API Usage
- See `docs/api/` for endpoint details
- Use JWT for authentication
- Example: `POST /api/tokenize` for tokenization

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Ensure tests and docs are updated

## Testing
```bash
npm test # backend
# Add tests for frontend, privacy-engine, ml-service as needed
```

## Deployment
- See `docs/deployment.md` for full instructions