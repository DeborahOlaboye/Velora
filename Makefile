# Velora Development Makefile
# This Makefile provides convenient commands for development, testing, and deployment

.PHONY: help install install-frontend install-contract build build-frontend build-contract test test-frontend test-contract clean clean-frontend clean-contract lint lint-frontend lint-contract format format-frontend format-contract dev dev-frontend dev-contract docker-build docker-run docker-stop docker-clean setup setup-frontend setup-contract deploy deploy-contract migrate-db

# Default target
help: ## Show this help message
	@echo "Velora Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation commands
install: install-frontend install-contract ## Install all dependencies

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-contract: ## Install contract dependencies
	cd contract && forge install

# Build commands
build: build-frontend build-contract ## Build all components

build-frontend: ## Build frontend application
	cd frontend && npm run build

build-contract: ## Build smart contracts
	cd contract && forge build

# Test commands
test: test-frontend test-contract ## Run all tests

test-frontend: ## Run frontend tests
	cd frontend && npm test

test-contract: ## Run contract tests
	cd contract && forge test

# Clean commands
clean: clean-frontend clean-contract ## Clean all build artifacts

clean-frontend: ## Clean frontend build artifacts
	cd frontend && rm -rf .next out node_modules/.cache

clean-contract: ## Clean contract build artifacts
	cd contract && rm -rf out cache

# Linting commands
lint: lint-frontend lint-contract ## Run all linters

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

lint-contract: ## Lint contract code
	cd contract && forge fmt --check src/**/*.sol

# Formatting commands
format: format-frontend format-contract ## Format all code

format-frontend: ## Format frontend code
	cd frontend && npm run lint -- --fix

format-contract: ## Format contract code
	cd contract && forge fmt src/**/*.sol

# Development commands
dev: ## Start all development servers
	@echo "Starting development servers..."
	@make -j2 dev-frontend dev-contract

dev-frontend: ## Start frontend development server
	cd frontend && npm run dev

dev-contract: ## Start contract development environment
	cd contract && forge build --watch

# Docker commands
docker-build: ## Build Docker containers
	docker-compose build

docker-run: ## Start all services with Docker
	docker-compose up -d

docker-stop: ## Stop all Docker services
	docker-compose down

docker-clean: ## Clean Docker containers and volumes
	docker-compose down -v --remove-orphans
	docker system prune -f

# Setup commands
setup: setup-frontend setup-contract ## Setup development environment

setup-frontend: ## Setup frontend environment
	cd frontend && npm install
	@echo "Frontend setup complete. Run 'make dev-frontend' to start development server."

setup-contract: ## Setup contract environment
	cd contract && forge install
	@echo "Contract setup complete. Run 'make dev-contract' to start development environment."

# Deployment commands
deploy: deploy-contract ## Deploy all components

deploy-contract: ## Deploy smart contracts
	cd contract && forge script script/Deploy.s.sol --rpc-url $$ETH_RPC_URL --private-key $$PRIVATE_KEY --broadcast --verify

# Database commands
migrate-db: ## Run database migrations
	cd frontend && npx prisma migrate dev

generate-db: ## Generate Prisma client
	cd frontend && npx prisma generate

# Utility commands
update-deps: ## Update all dependencies
	cd frontend && npm update
	cd contract && forge update

check-security: ## Run security checks
	cd frontend && npm audit
	cd contract && forge build --extra-output-files abi --extra-output-files devdoc --extra-output-files userdoc

# CI/CD commands
ci: install lint test build ## Run CI pipeline locally

# Environment setup
env-setup: ## Setup environment variables template
	@echo "Creating .env.example files..."
	@cp frontend/.env.example frontend/.env.local 2>/dev/null || echo "# Frontend Environment Variables" > frontend/.env.local
	@echo "NEXT_PUBLIC_APP_NAME=Velora" >> frontend/.env.local
	@echo "NEXT_PUBLIC_RPC_URL=https://mainnet.base.org" >> frontend/.env.local
	@echo "DATABASE_URL=postgresql://user:password@localhost:5432/velora" >> frontend/.env.local
	@echo "NEXTAUTH_SECRET=your-secret-key" >> frontend/.env.local
	@echo "NEXTAUTH_URL=http://localhost:3000" >> frontend/.env.local
	@echo "" > contract/.env
	@echo "ETH_RPC_URL=https://mainnet.base.org" >> contract/.env
	@echo "PRIVATE_KEY=your-private-key" >> contract/.env
	@echo "ETHERSCAN_API_KEY=your-etherscan-api-key" >> contract/.env

# Project information
info: ## Show project information
	@echo "Velora - Web3 Application"
	@echo "Frontend: Next.js $$(shell cd frontend && node -p "require('./package.json').dependencies.next")"
	@echo "Contract: Foundry with Solidity $$(shell grep 'solc_version' contract/foundry.toml | cut -d'"' -f2)"
	@echo "Database: Prisma with PostgreSQL"

# Quick start
quick-start: setup env-setup dev ## Quick start development environment
	@echo "Velora development environment is ready!"
	@echo "Frontend: http://localhost:3000"
	@echo "Contracts: Ready for deployment"