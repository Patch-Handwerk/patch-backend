# Patch Backend

## Getting Started

### Prerequisites

You need **PostgreSQL** and **Redis** running locally.

#### Using Docker (Recommended)
```bash
# PostgreSQL
docker run -d \
  --name patch-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=patch_db \
  -p 5432:5432 \
  postgres:16

# Redis
docker run -d \
  --name patch-redis \
  -p 6379:6379 \
  redis:7
```

#### Using Homebrew (macOS)
```bash
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis
createdb patch_db
```

### Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=patch_db

REDIS_HOST=localhost
REDIS_PORT=6379
```

### Setup & Run

```bash
# Install dependencies
npm install

# Run database migrations (creates tables)
npm run migration:run

# Seed evaluation data (phases, questions, answers)
npm run seed

# Start development server
npm run start:dev
```

**Server**: http://localhost:3002  
**API Docs**: http://localhost:3002/api

## API Specification

📋 **[API_SPECIFICATION.md](API_SPECIFICATION.md)** - Complete input/output data formats for all endpoints

## Technology Stack
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with refresh tokens
- **Caching**: Redis for token blacklisting

## Features
- ✅ Multi-tenant User Management
- ✅ Digital Maturity Assessment Engine
- ✅ Dashboard APIs for frontend integration
- ✅ Progress Calculation and storage
- ✅ Admin Oversight and user management
