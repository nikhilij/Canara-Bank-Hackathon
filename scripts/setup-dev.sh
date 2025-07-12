#!/bin/bash

# Canara Bank Hackathon - Development Environment Setup Script

set -e

echo "Setting up development environment for Canara Bank Hackathon..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm not found. Please install npm first."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env 2>/dev/null || echo "# Environment variables" > .env
fi

# Setup database (if using one)
echo "Setting up database..."
# Add database setup commands here if needed

# Install development tools
echo "Installing development tools..."
npm install -g nodemon eslint prettier

# Create necessary directories
mkdir -p logs
mkdir -p uploads
mkdir -p public/assets

# Set permissions
chmod +x scripts/*.sh

echo "Development environment setup complete!"
echo "Run 'npm start' to start the application."