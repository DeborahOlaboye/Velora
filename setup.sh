#!/bin/bash

# Velora Setup Script
# This script sets up the development environment for Velora

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_status "Starting Velora development environment setup..."

    # Check prerequisites
    print_status "Checking prerequisites..."

    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    if ! command_exists docker; then
        print_warning "Docker is not installed. Docker commands will not work."
    fi

    if ! command_exists make; then
        print_warning "Make is not installed. You can still use npm scripts directly."
    fi

    print_success "Prerequisites check complete."

    # Setup frontend
    print_status "Setting up frontend..."
    cd frontend

    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        print_success "Frontend dependencies installed."
    else
        print_status "Frontend dependencies already installed."
    fi

    # Setup database
    if command_exists npx; then
        print_status "Setting up Prisma..."
        npx prisma generate
        print_success "Prisma client generated."
    fi

    cd ..

    # Setup contracts
    print_status "Setting up smart contracts..."
    cd contract

    if command_exists forge; then
        if [ ! -d "lib" ] || [ ! -d "out" ]; then
            print_status "Installing contract dependencies..."
            forge install
            print_success "Contract dependencies installed."
        else
            print_status "Contract dependencies already installed."
        fi
    else
        print_warning "Foundry is not installed. Please install Foundry for contract development."
        print_status "Visit: https://book.getfoundry.sh/getting-started/installation"
    fi

    cd ..

    # Create environment files
    print_status "Setting up environment files..."

    if [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << EOF
# Frontend Environment Variables
NEXT_PUBLIC_APP_NAME=Velora
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
DATABASE_URL=postgresql://velora:password@localhost:5432/velora
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
EOF
        print_success "Frontend .env.local created."
    else
        print_status "Frontend .env.local already exists."
    fi

    if [ ! -f "contract/.env" ]; then
        cat > contract/.env << EOF
# Contract Environment Variables
ETH_RPC_URL=https://mainnet.base.org
PRIVATE_KEY=your-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key
EOF
        print_success "Contract .env created."
    else
        print_status "Contract .env already exists."
    fi

    # Setup Docker environment (optional)
    if command_exists docker && command_exists docker-compose; then
        print_status "Setting up Docker environment..."
        if [ ! -f "init-db.sql" ]; then
            cat > init-db.sql << EOF
-- Initial database setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOF
            print_success "Database initialization script created."
        fi
    fi

    print_success "Velora setup complete!"
    echo ""
    print_status "Next steps:"
    echo "  1. Update the environment variables in frontend/.env.local and contract/.env"
    echo "  2. Start the database: make docker-run (or use your own PostgreSQL)"
    echo "  3. Run database migrations: make migrate-db"
    echo "  4. Start development: make dev"
    echo ""
    print_status "Available commands:"
    echo "  make help          - Show all available commands"
    echo "  make dev           - Start development servers"
    echo "  make build         - Build all components"
    echo "  make test          - Run all tests"
    echo "  make docker-run    - Start services with Docker"
}

# Run main function
main "$@"