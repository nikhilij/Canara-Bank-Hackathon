#!/bin/bash

# Network setup script for blockchain network
set -e

# Configuration
NETWORK_NAME="blockchain-network"
COMPOSE_FILE="docker-compose.yml"

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

# Function to start the network
start_network() {
    print_status "Starting blockchain network..."
    
    # Create network if it doesn't exist
    if ! docker network ls | grep -q $NETWORK_NAME; then
        docker network create $NETWORK_NAME
        print_status "Created network: $NETWORK_NAME"
    fi
    
    # Start containers
    if [ -f "$COMPOSE_FILE" ]; then
        docker-compose up -d
        print_status "Network started successfully"
    else
        print_error "Docker compose file not found: $COMPOSE_FILE"
        exit 1
    fi
}

# Function to stop the network
stop_network() {
    print_status "Stopping blockchain network..."
    docker-compose down
    print_status "Network stopped"
}

# Function to restart the network
restart_network() {
    print_status "Restarting blockchain network..."
    stop_network
    start_network
}

# Function to show network status
status_network() {
    print_status "Network Status:"
    docker-compose ps
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up network..."
    docker-compose down -v
    docker system prune -f
    print_status "Cleanup completed"
}

# Main script logic
case "$1" in
    start)
        start_network
        ;;
    stop)
        stop_network
        ;;
    restart)
        restart_network
        ;;
    status)
        status_network
        ;;
    cleanup)
        cleanup
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|cleanup}"
        echo "  start   - Start the blockchain network"
        echo "  stop    - Stop the blockchain network"
        echo "  restart - Restart the blockchain network"
        echo "  status  - Show network status"
        echo "  cleanup - Clean up network and containers"
        exit 1
        ;;
esac