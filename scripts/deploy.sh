#!/bin/bash

# Canara Bank Hackathon Deployment Script

set -e  # Exit on any error

echo "Starting deployment process..."

# Configuration
PROJECT_NAME="canara-bank-hackathon"
BUILD_DIR="dist"
DEPLOY_DIR="/var/www/html"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    print_status "All dependencies are available"
}

# Install project dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    npm install
}

# Build the project
build_project() {
    print_status "Building the project..."
    npm run build
    
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "Build directory not found. Build may have failed."
        exit 1
    fi
    
    print_status "Build completed successfully"
}

# Deploy to server
deploy_to_server() {
    print_status "Deploying to server..."
    
    # Create backup of existing deployment
    if [ -d "$DEPLOY_DIR" ]; then
        print_status "Creating backup of existing deployment..."
        sudo cp -r "$DEPLOY_DIR" "${DEPLOY_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Copy build files to deployment directory
    sudo cp -r "$BUILD_DIR/"* "$DEPLOY_DIR/"
    
    # Set proper permissions
    sudo chown -R www-data:www-data "$DEPLOY_DIR"
    sudo chmod -R 755 "$DEPLOY_DIR"
    
    print_status "Deployment completed successfully"
}

# Restart services
restart_services() {
    print_status "Restarting services..."
    
    # Restart web server (adjust as needed)
    if systemctl is-active --quiet nginx; then
        sudo systemctl reload nginx
        print_status "Nginx reloaded"
    elif systemctl is-active --quiet apache2; then
        sudo systemctl reload apache2
        print_status "Apache2 reloaded"
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment for $PROJECT_NAME"
    
    check_dependencies
    install_dependencies
    build_project
    deploy_to_server
    restart_services
    
    print_status "Deployment completed successfully! 🚀"
    echo "Access your application at: http://localhost"
}

# Run main function
main "$@"