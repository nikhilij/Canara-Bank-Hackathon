# Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- Docker & Docker Compose
- Git

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Canara-Bank-Hackathon
```

### 2. Install Dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd frontend
npm install
```
#### Privacy Engine
```bash
cd privacy-engine
pip install -r requirements.txt
```
#### ML Service
```bash
cd ml-service
pip install -r requirements.txt
```

### 3. Environment Variables
Create `.env` files for backend, frontend, and services as needed.

## Local Development
Run each service in separate terminals:
```bash
# Backend
cd backend && npm run dev
# Frontend
cd frontend && npm run dev
# Privacy Engine
cd privacy-engine && python tokenizer.py
# ML Service
cd ml-service && python detector.py
```

## Docker Deployment
Run all services with Docker Compose:
```bash
cd blockchain/network
./network.sh start
cd ../..
docker-compose up --build
```

## Blockchain Network
- Chaincode is deployed via Hyperledger Fabric (see blockchain/network)
- Use `network.sh` to start/stop/restart the network

## Health Checks
- Backend: `/health`
- Frontend: `/health` (if implemented)
- Privacy Engine: `/health` (if implemented)
- ML Service: `/health` (if implemented)

## Cloud Deployment
- Deploy containers to AWS, Azure, GCP, or on-prem
- Use environment variables for secrets and endpoints

## Troubleshooting
- Check logs for each service
- Verify Docker containers are running
- Ensure all environment variables are set
- Check network connectivity between services