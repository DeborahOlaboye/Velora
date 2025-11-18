# Database Setup Guide

## Quick Setup (Recommended)

Run the automated setup script:

```bash
cd apps/web
./scripts/setup-database.sh
```

This will:
1. Create a PostgreSQL database named `velora_dev`
2. Create a database user `velora_user`
3. Set up permissions
4. Update your `.env` file
5. Run Prisma migrations

## Manual Setup

If the automated script doesn't work, follow these steps:

### 1. Create PostgreSQL Database

```bash
sudo -u postgres psql
```

Then run these SQL commands:

```sql
-- Create user
CREATE USER velora_user WITH PASSWORD 'velora_dev_password';

-- Create database
CREATE DATABASE velora_dev;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE velora_dev TO velora_user;

-- Connect to database
\c velora_dev

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO velora_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO velora_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO velora_user;

-- Exit
\q
```

### 2. Update Environment Variables

Create or update `apps/web/.env`:

```env
DATABASE_URL="postgresql://velora_user:velora_dev_password@localhost:5432/velora_dev?schema=public"
```

### 3. Run Prisma Migrations

```bash
cd apps/web
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate Prisma Client
- Apply the schema to your database

### 4. Verify Setup

Check that tables were created:

```bash
npx prisma studio
```

This opens a visual database editor at http://localhost:5555

## Alternative: Docker PostgreSQL

If you prefer Docker:

```bash
# Start PostgreSQL in Docker
docker run --name velora-postgres \
  -e POSTGRES_USER=velora_user \
  -e POSTGRES_PASSWORD=velora_dev_password \
  -e POSTGRES_DB=velora_dev \
  -p 5432:5432 \
  -d postgres:16-alpine

# Update .env
echo 'DATABASE_URL="postgresql://velora_user:velora_dev_password@localhost:5432/velora_dev?schema=public"' > .env

# Run migrations
npx prisma migrate dev --name init
```

## Database Schema

The database includes these tables:

- **User** - Worker profiles and verification status
- **Contribution** - Contribution history with blockchain data
- **WithdrawalRequest** - Emergency withdrawal requests
- **Vote** - Community votes on withdrawal requests
- **Notification** - User notifications
- **ActivityLog** - Audit trail of all actions
- **PoolStats** - Aggregated pool statistics
- **SyncStatus** - Blockchain event synchronization state

## Useful Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Format schema file
npx prisma format
```

## Troubleshooting

### Connection refused

Make sure PostgreSQL is running:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Permission denied

Check PostgreSQL authentication settings in `/etc/postgresql/*/main/pg_hba.conf`

### Database exists error

Drop and recreate:
```bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS velora_dev;"
sudo -u postgres psql -c "CREATE DATABASE velora_dev;"
```

## Production Setup

For production, use a managed PostgreSQL service like:
- **Supabase** (recommended, free tier available)
- **Neon** (serverless PostgreSQL)
- **Railway** (easy deployment)
- **AWS RDS**
- **Google Cloud SQL**

Update `DATABASE_URL` in production environment variables.
