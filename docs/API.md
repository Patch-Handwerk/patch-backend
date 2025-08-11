# API Specification - Patch Digital Maturity Assessment

## Overview
This document defines the input/output data formats for the Patch Digital Maturity Assessment Backend API.

**Base URL**: `http://localhost:3002`

---

## 1. Dashboard APIs

### 1.1 Get All Phases
**Endpoint**: `GET /evaluation/phases`

**Purpose**: Initial dashboard load - fetches all assessment phases

**Response**:
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

### 1.2 Get Subphases for Phase
**Endpoint**: `GET /evaluation/phases/{phaseId}/subphases`

**Purpose**: Fetches subphases when user clicks on a phase

**Parameters**:
- `phaseId` (path): ID of the phase

**Response**:
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

### 1.3 Get Question and Answers
**Endpoint**: `GET /evaluation/subphases/{subphaseId}/question`

**Purpose**: Fetches question and answers when user clicks on a subphase

**Parameters**:
- `subphaseId` (path): ID of the subphase

**Response**:
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
      },
      {
        "id": 2,
        "answer": "Bestellungen erfolgen telefonisch oder persönlich beim Lieferanten",
        "point": 3,
        "isStopAnswer": false,
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

### 1.4 Get Complete Phase Data
**Endpoint**: `GET /evaluation/phases/{phaseId}/complete`

**Purpose**: Preloads all data for a phase (subphases, questions, answers)

**Parameters**:
- `phaseId` (path): ID of the phase

**Response**:
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

### 1.5 Get Complete Assessment
**Endpoint**: `GET /evaluation/complete-assessment`

**Purpose**: Loads entire assessment data (all phases with complete data)

**Response**:
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

---

## 2. Progress Calculation API

### 2.1 Calculate Progress
**Endpoint**: `POST /evaluation/results`

**Purpose**: Calculate and store assessment results

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
    },
    {
      "answerId": 4,
      "answerText": "Digitale Dokumentation im Büro",
      "point": 3,
      "level": 2,
      "stage": "Digital Apprentice",
      "description": "Digital documentation (office)"
    }
  ]
}
```

**Response**:
```json
{
  "message": "Progress calculated successfully",
  "totalPoints": 10,
  "calculatedLevel": 2,
  "calculatedStage": "Digital Apprentice",
  "calculatedDescription": "Digital documentation (office)",
  "selectedAnswersCount": 3
}
```

---

## 3. Authentication APIs

### 3.1 User Registration
**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "Max GmbH",
  "email": "max@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Max GmbH",
    "email": "max@example.com",
    "role": "CONSULTANT",
    "status": "PENDING"
  }
}
```

### 3.2 User Login
**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "max@example.com",
  "password": "password123"
}
```

**Response**:
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

---

## 4. Admin APIs

### 4.1 Get All Users
**Endpoint**: `GET /admin/users`

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Response**:
```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Max GmbH",
      "email": "max@example.com",
      "role": "CONSULTANT",
      "status": "PENDING",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalUsers": 1
}
```

### 4.2 Update User Status
**Endpoint**: `POST /admin/user/{userId}`

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

**Response**:
```json
{
  "message": "User status updated successfully",
  "user": {
    "id": 1,
    "name": "Max GmbH",
    "email": "max@example.com",
    "status": "APPROVED"
  }
}
```

---

## 5. Error Responses

### 5.1 Validation Error (400)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 5.2 Not Found Error (404)
```json
{
  "statusCode": 404,
  "message": "Phase with ID 999 not found",
  "error": "Not Found"
}
```

### 5.3 Unauthorized Error (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 5.4 Internal Server Error (500)
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 6. Data Types

### 6.1 Assessment Structure
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

### 6.2 User Roles
- `ADMIN`: System administrator
- `CONSULTANT`: Company user

### 6.3 User Status
- `PENDING`: Awaiting admin approval
- `APPROVED`: Active user
- `REJECTED`: Rejected by admin

### 6.4 Answer Properties
- `point`: Score value (1-12)
- `level`: Maturity level (1-8)
- `stage`: Digital maturity stage
- `description`: Detailed description
- `isStopAnswer`: Boolean flag for stop answers

---

## 7. Frontend Integration Example

```javascript
// Progressive loading approach
const phases = await fetch('/evaluation/phases').then(r => r.json());
const subphases = await fetch(`/evaluation/phases/${phaseId}/subphases`).then(r => r.json());
const questionData = await fetch(`/evaluation/subphases/${subphaseId}/question`).then(r => r.json());

// Calculate progress
const result = await fetch('/evaluation/results', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(progressData)
}).then(r => r.json());
```
