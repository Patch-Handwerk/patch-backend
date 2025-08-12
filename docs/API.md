# Complete API Documentation - Patch Digital Maturity Assessment

## Overview
This document defines all API endpoints for the Patch Digital Maturity Assessment Backend API.

**Base URL**: `http://localhost:3000`

---

## 🔐 **Authentication APIs**

### Register User
**Endpoint**: `POST /auth/register`

**Purpose**: Register a new user account

**Request Body**:
```json
{
  "name": "Max GmbH",
  "email": "max@example.com",
  "password": "password123"
}
```

**Response (201)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Max GmbH",
    "email": "max@example.com",
    "role": "CONSULTANT",
    "user_status": "PENDING"
  }
}
```

### Login User
**Endpoint**: `POST /auth/login`

**Purpose**: Authenticate user and get access tokens

**Request Body**:
```json
{
  "email": "max@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Max GmbH",
    "email": "max@example.com",
    "role": "CONSULTANT"
  }
}
```

### Forgot Password
**Endpoint**: `POST /auth/forgot-password`

**Purpose**: Request password reset email

**Request Body**:
```json
{
  "email": "max@example.com"
}
```

**Response (200)**:
```json
{
  "message": "Password reset email sent successfully"
}
```

### Reset Password
**Endpoint**: `POST /auth/reset-password`

**Purpose**: Reset password using token

**Request Body**:
```json
{
  "token": "reset_token_here",
  "password": "newpassword123"
}
```

**Response (200)**:
```json
{
  "message": "Password reset successfully"
}
```

### Verify Email
**Endpoint**: `GET /auth/verify-email`

**Purpose**: Verify user email address

**Parameters**:
- `token` (query): Email verification token

**Response (200)**:
```json
{
  "message": "Email verified successfully"
}
```

### Refresh Token
**Endpoint**: `POST /auth/refresh`

**Purpose**: Refresh JWT access token

**Headers**:
```
Authorization: Bearer {refresh_token}
```

**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200)**:
```json
{
  "message": "Tokens refreshed successfully",
  "access_token": "new_access_token_here",
  "refresh_token": "new_refresh_token_here"
}
```

### Logout
**Endpoint**: `POST /auth/logout`

**Purpose**: Logout user and invalidate tokens

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response (200)**:
```json
{
  "message": "Logged out successfully"
}
```

---

## 👨‍💼 **Admin APIs**

### Get All Users
**Endpoint**: `GET /admin/users`

**Purpose**: Get all users with optional filters (Admin only)

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Query Parameters**:
- `status` (optional): Filter by user status (PENDING, APPROVED, REJECTED)
- `role` (optional): Filter by user role (ADMIN, CONSULTANT)

**Response (200)**:
```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Max GmbH",
      "email": "max@example.com",
      "role": "CONSULTANT",
      "user_status": "PENDING",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalUsers": 1
}
```

### Update User Status
**Endpoint**: `POST /admin/user/{userId}`

**Purpose**: Approve or reject user (Admin only)

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Parameters**:
- `userId` (path): ID of the user

**Request Body**:
```json
{
  "user_status": "APPROVED"
}
```

**Response (200)**:
```json
{
  "message": "User status updated successfully",
  "user": {
    "id": 1,
    "name": "Max GmbH",
    "email": "max@example.com",
    "user_status": "APPROVED"
  }
}
```

---

## 📊 **Evaluation APIs**

### Get All Phases
**Endpoint**: `GET /evaluation/phases`

**Purpose**: Get all assessment phases for dashboard

**Response (200)**:
```json
{
  "message": "Phases retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Planungs- und Logistikphase",
      "subphasesCount": 3
    },
    {
      "id": 2,
      "name": "Informationsphase",
      "subphasesCount": 2
    }
  ],
  "totalPhases": 6
}
```

### Get Subphases by Phase
**Endpoint**: `GET /evaluation/phases/{phaseId}/subphases`

**Purpose**: Get subphases for a specific phase

**Parameters**:
- `phaseId` (path): ID of the phase

**Response (200)**:
```json
{
  "message": "Subphases retrieved successfully",
  "phase": {
    "id": 1,
    "name": "Planungs- und Logistikphase"
  },
  "data": [
    {
      "id": 1,
      "name": "Materialbeschaffung"
    },
    {
      "id": 2,
      "name": "Subunternehmer"
    }
  ],
  "totalSubphases": 3
}
```

### Get Question by Subphase
**Endpoint**: `GET /evaluation/subphases/{subphaseId}/question`

**Purpose**: Get question and answers for a specific subphase

**Parameters**:
- `subphaseId` (path): ID of the subphase

**Response (200)**:
```json
{
  "message": "Question and answers retrieved successfully",
  "subphase": {
    "id": 1,
    "name": "Materialbeschaffung"
  },
  "question": {
    "id": 1,
    "question": "Wie strukturieren Sie Ihren Materialbeschaffungsprozess?",
    "sortId": 1
  },
  "answersByLevel": {
    "1": [
      {
        "id": 1,
        "answer": "Keine zentrale Dokumentation, keine digitale Nachverfolgung",
        "point": 1,
        "isStopAnswer": true,
        "level": 1,
        "stage": "Digi Apprentice",
        "description": "Analog Procurement"
      }
    ],
    "2": [
      {
        "id": 5,
        "answer": "Manuelle Pflege der Tabellen, keine automatisierten Prozesse",
        "point": 1,
        "isStopAnswer": true,
        "level": 2,
        "stage": "Digi Apprentice",
        "description": "Digital Documentation (Office)"
      }
    ]
  },
  "totalAnswers": 15,
  "levelsCount": 8
}
```

### Get Complete Phase Data
**Endpoint**: `GET /evaluation/phases/{phaseId}/complete`

**Purpose**: Get complete data for a specific phase (subphases, questions, answers)

**Parameters**:
- `phaseId` (path): ID of the phase

**Response (200)**:
```json
{
  "message": "Complete phase data retrieved successfully",
  "phase": {
    "id": 1,
    "name": "Planungs- und Logistikphase"
  },
  "subphases": [
    {
      "id": 1,
      "name": "Materialbeschaffung",
      "question": {
        "id": 1,
        "question": "Wie strukturieren Sie Ihren Materialbeschaffungsprozess?",
        "sortId": 1,
        "answersByLevel": {
          "1": [...],
          "2": [...]
        },
        "totalAnswers": 15
      }
    }
  ],
  "totalSubphases": 3
}
```

### Get Complete Assessment
**Endpoint**: `GET /evaluation/complete-assessment`

**Purpose**: Get complete assessment data (all phases with complete data)

**Response (200)**:
```json
{
  "message": "Complete assessment data retrieved successfully",
  "phases": [
    {
      "id": 1,
      "name": "Planungs- und Logistikphase",
      "subphases": [...],
      "totalSubphases": 3
    }
  ],
  "totalPhases": 6,
  "totalSubphases": 12
}
```

### Calculate Progress
**Endpoint**: `POST /evaluation/answers`

**Purpose**: Submit answers and calculate progress percentage

**Request Body**:
```json
{
  "tenantId": 1,
  "phaseName": "Planungs- und Logistikphase",
  "subphaseName": "Materialbeschaffung",
  "questionId": 1,
  "questionText": "Wie strukturieren Sie Ihren Materialbeschaffungsprozess?",
  "selectedAnswers": [
    {
      "answerId": 1,
      "answerText": "Keine zentrale Dokumentation, keine digitale Nachverfolgung",
      "point": 1,
      "level": 1,
      "stage": "Digital Apprentice",
      "description": "Analog procurement"
    },
    {
      "answerId": 3,
      "answerText": "Materialbedarfe werden händisch aufgelistet",
      "point": 6,
      "level": 1,
      "stage": "Digital Apprentice",
      "description": "Analog procurement"
    }
  ]
}
```

**Response (201)**:
```json
{
  "message": "Progress calculated successfully",
  "totalPoints": 7,
  "calculatedLevel": 1,
  "calculatedStage": "Digital Apprentice",
  "calculatedDescription": "Analog procurement",
  "selectedAnswersCount": 2,
  "progress": 13
}
```

### Get User Progress
**Endpoint**: `GET /evaluation/{tenantId}/progress`

**Purpose**: Get progress history for a specific user

**Parameters**:
- `tenantId` (path): The tenant ID of the user

**Response (200)**:
```json
{
  "message": "User progress retrieved successfully",
  "data": [
    {
      "id": 1,
      "phaseName": "Planungs- und Logistikphase",
      "subphaseName": "Materialbeschaffung",
      "progress": 13,
      "level": 1,
      "stage": "Digital Apprentice",
      "description": "Analog procurement",
      "totalPoints": 7,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalResults": 1
}
```

---

## 📊 **Progress Calculation Formula**

The progress is calculated as a percentage based on the 54-point system:

```
Progress Percentage = (Total Selected Points / 54) × 100
```

**Examples**:
- 10 points → (10/54) × 100 = 19%
- 25 points → (25/54) × 100 = 46%
- 30 points → (30/54) × 100 = 56%
- 40 points → (40/54) × 100 = 74%
- 54 points → (54/54) × 100 = 100%

---

## 🚨 **Error Responses**

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Unauthorized Error (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Not Found Error (404)
```json
{
  "statusCode": 404,
  "message": "Phase with ID 999 not found",
  "error": "Not Found"
}
```

### Internal Server Error (500)
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 📋 **Data Types & Enums**

### User Roles
- `ADMIN`: System administrator
- `CONSULTANT`: Company user

### User Status
- `PENDING`: Awaiting admin approval
- `APPROVED`: Active user
- `REJECTED`: Rejected by admin

### Assessment Structure
```
Phase (6 total)
├── SubPhase (multiple per phase)
    ├── Question (1 per subphase)
        ├── Answer (multiple per question)
            ├── Points (1-12 per answer)
            ├── Level (1-8 maturity level)
            ├── Stage (e.g., "Digital Apprentice")
            └── Description (e.g., "Analog Procurement")
```

### Answer Properties
- `point`: Score value (1-12)
- `level`: Maturity level (1-8)
- `stage`: Digital maturity stage
- `description`: Detailed description
- `isStopAnswer`: Boolean flag for stop answers

---

## 🔧 **Data Transfer Objects (DTOs)**

### CalculateProgressDto
```typescript
{
  tenantId: number;
  phaseName: string;
  subphaseName: string;
  questionId: number;
  questionText: string;
  selectedAnswers: SimpleSelectedAnswerDto[];
}
```

### SimpleSelectedAnswerDto
```typescript
{
  answerId: number;
  answerText: string;
  point: number;
  level?: number;
  stage?: string;
  description?: string;
}
```

### LoginDto
```typescript
{
  email: string;
  password: string;
}
```

### RegisterDto
```typescript
{
  name: string;
  email: string;
  password: string;
}
```

### ForgotPasswordDto
```typescript
{
  email: string;
}
```

### ResetPasswordDto
```typescript
{
  token: string;
  password: string;
}
```

### RefreshTokenDto
```typescript
{
  refreshToken: string;
}
```

### GetUsersDto
```typescript
{
  status?: string;
  role?: string;
}
```

### UpdateUserStatusDto
```typescript
{
  user_status: string;
}
```

---

## 📝 **Notes**

1. **Authentication**: Most endpoints require proper authentication via JWT tokens
2. **Progress Calculation**: Based on 54-point maximum per phase
3. **User Identification**: Uses tenant_id for user identification
4. **Admin Access**: Admin endpoints require ADMIN role
5. **Validation**: All inputs are validated using class-validator decorators
6. **Error Handling**: Consistent error response format across all endpoints

---

## 🔗 **Related Documentation**

- [Swagger UI](http://localhost:3000/api) - Interactive API documentation
- [Progress Calculation Examples](./PROGRESS_CALCULATION_54_POINTS.md)
- [Database Schema](./database/entities/)
