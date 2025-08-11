# Patch Backend

# Run database migrations and seed data
npm run migration:run
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
