#!/bin/bash

# Database Setup Script for Velora
# This script sets up a local PostgreSQL database for development

set -e

echo "🗄️  Setting up Velora development database..."
echo ""

# Database configuration
DB_NAME="velora_dev"
DB_USER="velora_user"
DB_PASSWORD="velora_dev_password"
DB_HOST="localhost"
DB_PORT="5432"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    echo "Install it with: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Create database and user
echo "📝 Creating database and user..."
sudo -u postgres psql <<EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Connect to the database and grant schema privileges
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

EOF

echo "✅ Database and user created"
echo ""

# Update .env file
ENV_FILE=".env"
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"

echo "📝 Updating $ENV_FILE..."
if grep -q "^DATABASE_URL=" "$ENV_FILE" 2>/dev/null; then
    # Update existing entry
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" "$ENV_FILE"
else
    # Add new entry
    echo "DATABASE_URL=\"$DATABASE_URL\"" >> "$ENV_FILE"
fi

echo "✅ Environment file updated"
echo ""

# Run Prisma migrations
echo "📝 Running Prisma migrations..."
npx prisma migrate dev --name init

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Database details:"
echo "  Name: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Host: $DB_HOST:$DB_PORT"
echo ""
echo "Connection string has been saved to $ENV_FILE"
echo ""
echo "🚀 You can now run: npm run dev"
