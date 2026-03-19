# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS backend for a **Digital Maturity Assessment** platform serving craftsmen businesses. Multi-tenant system with role-based access (ADMIN, CONSULTANT, CRAFTSMAN). Users complete structured evaluations (Phases → SubPhases → Questions → Answers) to determine their digital maturity level (1-6).

## Commands

```bash
npm run start:dev          # Development server (port 3002)
npm run build              # TypeScript compilation to dist/
npm run lint               # ESLint with auto-fix
npm run test               # Jest unit tests
npm run test:watch         # Jest watch mode
npm run test:cov           # Coverage report
npm run test:e2e           # End-to-end tests
npm run migration:generate # Generate TypeORM migration
npm run migration:run      # Run pending migrations
npm run seed               # Seed evaluation phases/questions data
npm run export:docs        # Export Swagger docs
```

To run a single test file: `npx jest src/modules/auth/auth.service.spec.ts`

## Infrastructure Setup

```bash
docker-compose up -d       # Start PostgreSQL (5432) and Redis (6379)
cp example.env .env        # Then fill in secrets
```

## Architecture

### Module Structure

```
src/
├── main.ts                # Bootstrap: global interceptor, filter, CORS, Swagger
├── root.module.ts         # Root: ConfigModule + TypeORM + feature modules
├── common/                # Guards, interceptors, decorators (barrel: src/common)
├── config/configurations/ # jwt, redis, oauth, mail, admin, app configs
├── core/exceptions/       # HttpExceptionFilter
├── database/
│   ├── entities/          # TypeORM entities (barrel: src/database/entities)
│   ├── migrations/        # TypeORM migrations
│   └── seeders/           # Evaluation seed data
└── modules/               # auth, admin, evaluation, email
```

Each module follows: `controllers/`, `services/`, `dto/`, `index.ts` barrel export.

### Database Schema

```
Phase (1) → (N) SubPhase (1) → (1) Question (1) → (N) Answer
User (1) → (N) Results  ← progress stored per question/user
```

Migrations are used (not `synchronize: true`). SSL enabled in production only.

### Naming Conventions

- **Database columns**: `snake_case` (e.g., `has_finished_onboarding`)
- **TypeORM entity properties**: `camelCase` with explicit `@Column({ name: 'snake_case' })` mapping when they differ (e.g., `hasFinishedOnboarding` maps to `has_finished_onboarding`)
- **DTOs & API responses**: Always `camelCase` — never expose `snake_case` to the frontend
- **Migration files**: `{N}_{Description}.ts` (e.g., `3_AddHasFinishedOnboarding.ts`)

### Translation Keys

All assessment entities (phases, subphases, questions, answers, stages) have `translationKey` columns (or `answerTranslationKey`, `stageKey`, `descriptionKey` for answers). Keys follow `assessment.{entityType}.{camelCaseSlug}` pattern. These are stored in the DB alongside the original German text strings. The seeder in `src/database/seeders/` populates them using an upsert pattern.

### Seed Data

Seeders in `src/database/seeders/` use an **upsert pattern**: find existing rows by a unique field, update if data changed, create if missing. This makes `npm run seed` safe to re-run. Key files:
- `seed-data.ts` — all phase/subphase/question/answer/stage definitions with translation keys
- `initial-survey-data.seed.ts` — upsert helpers that write to the database

### Authentication

- JWT access tokens (15m) + refresh tokens (7d), blacklisted in Redis on logout
- OAuth (Google, LinkedIn, GitHub): `GET /auth/{provider}?role=...` → callback → redirect to `{FRONTEND_URL}/auth/callback?token=...`
- Admin auto-created on first login using `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars
- `GET /auth/me` — returns fresh user profile (used by frontend to check `hasFinishedOnboarding` etc.)
- `PATCH /auth/users/onboarding` — sets `hasFinishedOnboarding = true` for the authenticated user

**Adding new user fields**: Update entity → DTO (`auth-response.dto.ts`) → service (`getAllUsers` select, `getCurrentUser` select, `getUserDetails` spread) → controller if needed. The frontend also needs updating (see root `CLAUDE.md`).

### Key Conventions

**Import patterns** — always use barrel exports:
- `import { User } from 'src/database/entities'`
- `import { AppConfifuration } from 'src/config'` ← note: `AppConfifuration` typo is intentional in codebase
- `import { JwtBlacklistGuard, Roles } from 'src/common'`

**Guards:**
- `JwtBlacklistGuard`: Standard protected routes (checks Redis blacklist)
- `JwtAuthGuard`: Simple JWT check without blacklist
- `RolesGuard` + `@Roles(Role.ADMIN)`: Admin-only endpoints

**Response format** — all responses via global `ResponseInterceptor`:
```typescript
{ success: boolean, message: string, data?: T, meta?: { timestamp, path, method } }
```

**Config access:**
```typescript
configService.get<string>('accessTokenSecret')   // flat key
configService.get('redis.host')                  // namespaced
```

### Progress Calculation Algorithm

54-point maximum per question; dominant level/stage determination:
1. Sum selected answer points
2. `progress = Math.round((totalPoints / 54) * 100)` → stored as `"75%"`
3. Group answers by level (1-6), find dominant level (highest wins ties)
4. Within dominant level, find most common stage and description

Maturity levels: 1-3 = "Digi Apprentice", 4-5 = "Digi Journeyman", 6 = "Digi Master"

### Adding New Features

**New endpoint:** Add DTO → service method → controller route (with Swagger decorators) → export from barrel `index.ts`.

**New module:** Create `src/modules/{name}/controllers/`, `services/`, `dto/` + module file with `TypeOrmModule.forFeature([...entities])` → register in `root.module.ts` → add to `src/modules/index.ts`.

## Dev URLs

- API: http://localhost:3002
- Swagger: http://localhost:3002/api
- Health: GET http://localhost:3002/health
