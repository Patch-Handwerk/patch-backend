# Patch Backend - AI Coding Agent Instructions

## Architecture Overview

NestJS backend for a **Digital Maturity Assessment** platform serving craftsmen businesses. Multi-tenant system with role-based access (ADMIN, CONSULTANT, CRAFTSMAN).

**Core Domain Flow:**

1. Users complete evaluation phases → Subphases → Questions → Answers
2. Progress is calculated per question with dominant level/stage determination
3. Results stored per user with percentage-based progress tracking

**Module Structure:** `src/modules/{module}/` contains `controllers/`, `services/`, `dto/`, organized with barrel exports (`index.ts`).

## Key Conventions

### Import Patterns

- Use barrel exports: `import { User } from 'src/database/entities'` not individual files
- Configs: `import { AppConfifuration } from 'src/config'` (note: typo is intentional in codebase)
- Guards/decorators: `import { JwtBlacklistGuard, Roles } from 'src/common'`

### DTO Patterns

All DTOs use `class-validator` + `@nestjs/swagger` decorators:

```typescript
@ApiProperty({ description: '...', example: '...' })
@IsString()
fieldName: string;
```

### Entity Patterns

TypeORM entities in `src/database/entities/` with snake_case column names:

- Foreign keys: `@Column({ type: 'int', nullable: true }) user_id: number | null`
- Enums imported from `src/modules/admin/enums/` (Role, UserStatus)

### Response Format

All responses follow `StandardResponse<T>` via global `ResponseInterceptor`:

```typescript
{ success: boolean, message: string, data?: T, meta?: { timestamp, path, method } }
```

### Authentication Guards

- `JwtBlacklistGuard`: Standard protected routes (checks Redis blacklist)
- `JwtAuthGuard`: Simple JWT validation without blacklist check
- `RolesGuard` + `@Roles(Role.ADMIN)`: Role-based access
- OAuth guards: `GoogleAuthGuard`, `LinkedInAuthGuard`, `GitHubAuthGuard`

## Commands

```bash
npm run start:dev          # Development server (port 3002)
npm run migration:run      # Run TypeORM migrations
npm run seed               # Seed evaluation phases/questions data
npm run lint               # ESLint with auto-fix
npm run test               # Jest unit tests
```

## Database Schema (Evaluation Domain)

```
Phase (1) → (N) SubPhase (1) → (1) Question (1) → (N) Answer
                                                       ↓
User (1) → (N) Results ← stores progress per question/user
```

Seed data: `src/database/seeders/seed-data.ts` defines all phases, subphases, questions, and answer levels (1-6 maturity levels).

## Configuration

Environment-based configs in `src/config/configurations/`:

- `jwt.config.ts`: Access/refresh token secrets and expiration
- `redis.config.ts`: Token blacklist storage
- `admin.config.ts`: Default admin credentials (auto-created on first login)

Config accessed via: `configService.get<string>('accessTokenSecret')` or namespaced `configService.get('redis.host')`.

## Adding New Features

**New endpoint in existing module:**

1. Add DTO in `dto/` with validation decorators
2. Add service method in `services/`
3. Add controller route with Swagger decorators
4. Export from barrel `index.ts` files

**New module:**

1. Create folder structure: `src/modules/{name}/controllers/`, `services/`, `dto/`
2. Create module file importing TypeOrmModule.forFeature([...entities])
3. Register in `root.module.ts` imports
4. Add barrel exports to `src/modules/index.ts`

## OAuth Flow Pattern

All OAuth providers (Google, LinkedIn, GitHub) follow the same pattern:

1. **Initiate**: `GET /auth/{provider}?role=consultant|craftsman` - Redirects to provider
2. **Callback**: `GET /auth/{provider}/callback` - Provider redirects here with auth code
3. **Frontend Redirect**: On success, redirects to `{frontendRedirectUrl}/auth/callback?token=...&refreshToken=...&role=...`
4. **Error Handling**: On failure, redirects to `{frontendRedirectUrl}/auth/error?message=...`

Strategies normalize OAuth data via `authService.oauthLogin()` which creates/updates users and generates JWT tokens.

## Progress Calculation Algorithm

The evaluation system uses a **54-point maximum** per question with **dominant level/stage determination**:

```typescript
// 1. Sum all selected answer points
const totalPoints = selectedAnswers.reduce((sum, a) => sum + a.point, 0);

// 2. Calculate percentage against 54 max points
const progressPercentage = Math.round((totalPoints / 54) * 100);

// 3. Group answers by level, find dominant (highest level wins ties)
// 4. Within dominant level, find most common stage and description
```

**Answer structure** (from seed-data.ts): Each level (1-6) maps to a maturity stage:

- Level 1-3: "Digi Apprentice" (Analog → Digital Documentation → Online Portals)
- Level 4-5: "Digi Journeyman" (Specialized Software → Integrated Systems)
- Level 6: "Digi Master" (Full Automation)

Results stored in `results` table with `progress` as percentage string (e.g., "75%"), `level`, `stage`, and `description`.

## Testing Notes

- Server: http://localhost:3002
- Swagger docs: http://localhost:3002/api
- Health check: GET /health
- Admin auto-creates on first login with env credentials
