# Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Canara-Bank-Hackathon
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the environment variables as needed:
```
DATABASE_URL=your_database_url
API_KEY=your_api_key
PORT=3000
```

## Development Deployment

### Local Development
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Production Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Start Production Server
```bash
npm start
# or
yarn start
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t canara-bank-app .
```

### Run Docker Container
```bash
docker run -p 3000:3000 canara-bank-app
```

## Cloud Deployment

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Vercel
```bash
vercel --prod
```

## Health Checks
- Application health: `/health`
- Database connection: `/health/db`

## Troubleshooting
- Check logs: `npm run logs`
- Verify environment variables
- Ensure all dependencies are installed
- Check port availability