#!/bin/bash

# Database setup script for Canara Bank Hackathon

set -e

# Configuration
DB_NAME="canara_bank_db"
DB_USER="canara_user"
DB_PASSWORD="canara_password"
DB_HOST="localhost"
DB_PORT="5432"

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

# Check if PostgreSQL is installed
check_postgresql() {
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed. Please install it first."
        exit 1
    fi
    print_status "PostgreSQL is installed"
}

# Check if PostgreSQL service is running
check_postgresql_service() {
    if ! systemctl is-active --quiet postgresql; then
        print_warning "PostgreSQL service is not running. Starting it..."
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    fi
    print_status "PostgreSQL service is running"
}

# Create database and user
setup_database() {
    print_status "Setting up database and user..."
    
    # Switch to postgres user and create database
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || print_warning "Database $DB_NAME already exists"
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || print_warning "User $DB_USER already exists"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"
    
    print_status "Database setup completed"
}

# Run database migrations/schema setup
setup_schema() {
    print_status "Setting up database schema..."
    
    # Check if schema files exist
    if [ -f "../database/schema.sql" ]; then
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../database/schema.sql
        print_status "Schema applied successfully"
    else
        print_warning "Schema file not found at ../database/schema.sql"
    fi
    
    # Apply seed data if exists
    if [ -f "../database/seed.sql" ]; then
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../database/seed.sql
        print_status "Seed data applied successfully"
    else
        print_warning "Seed file not found at ../database/seed.sql"
    fi
}

# Create .env file with database configuration
create_env_file() {
    print_status "Creating .env file..."
    
    cat > ../.env << EOF
# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
EOF
    
    print_status ".env file created"
}

# Test database connection
test_connection() {
    print_status "Testing database connection..."
    
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" &> /dev/null; then
        print_status "Database connection successful"
    else
        print_error "Database connection failed"
        exit 1
    fi
}

# Main execution
main() {
    print_status "Starting database setup..."
    
    check_postgresql
    check_postgresql_service
    setup_database
    setup_schema
    create_env_file
    test_connection
    
    print_status "Database setup completed successfully!"
    print_status "You can now connect to the database using:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
}

# Run main function
main "$@"