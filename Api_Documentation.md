# Simple Progress Calculation API

## Overview
This API provides a simple one-time calculation of progress, level, stage, and description based on all selected answers sent from the frontend.

## Endpoint

### POST `/evaluation/calculate-simple-progress`

**Description:** Calculate progress, level, stage, and description from all selected answers in one API call.

**Request Body:**
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

**Response:**
```json
{
  "message": "Progress calculated successfully",
  "totalPoints": 10,
  "calculatedLevel": 1,
  "calculatedStage": "Digital Apprentice",
  "calculatedDescription": "Analog procurement",
  "selectedAnswersCount": 3
}
```

## Field Descriptions

### Request Fields:
- **tenantId** (number): The user's tenant ID
- **phaseName** (string): Name of the phase (e.g., "Planungs- und Logistikphase")
- **subphaseName** (string): Name of the subphase (e.g., "Materialbeschaffung")
- **questionId** (number): ID of the question
- **questionText** (string): Text of the question
- **selectedAnswers** (array): Array of selected answer objects

### Selected Answer Fields:
- **answerId** (number): Unique ID of the answer
- **answerText** (string): Text of the selected answer
- **point** (number): Points awarded for this answer
- **level** (number, optional): Digital maturity level (1-8)
- **stage** (string, optional): Digital maturity stage (e.g., "Digital Apprentice")
- **description** (string, optional): Description of the answer category

### Response Fields:
- **message** (string): Success message
- **totalPoints** (number): Sum of all selected answer points
- **calculatedLevel** (number): Dominant level from selected answers
- **calculatedStage** (string): Dominant stage from selected answers
- **calculatedDescription** (string): Dominant description from selected answers
- **selectedAnswersCount** (number): Number of selected answers

## Calculation Logic

1. **Total Points**: Sum of all `point` values from selected answers
2. **Dominant Level**: Level with the highest count of answers, then highest total points
3. **Dominant Stage**: Most common stage within the dominant level
4. **Dominant Description**: Most common description within the dominant level

## Postman Testing

### Step 1: Test the Endpoint
**Request:**
- Method: `POST`
- URL: `http://localhost:3001/evaluation/calculate-simple-progress`
- Headers: `Content-Type: application/json`
- Body: Use the JSON example above

**Expected Response:**
- Status: `201 Created`
- Body: Progress calculation results

### Step 2: Verify Database Storage
The calculated results are automatically saved to the `client_answer` table with:
- `tenant_id`: The provided tenant ID
- `phase_name`: The provided phase name
- `subphase_name`: The provided subphase name
- `question_id`: The provided question ID
- `total_points`: Calculated total points
- `level`: Calculated dominant level
- `stage`: Calculated dominant stage
- `description`: Calculated dominant description

## Error Handling

**400 Bad Request:**
- Missing required fields
- Invalid data types
- Validation errors

**404 Not Found:**
- User with specified tenant_id not found

**500 Internal Server Error:**
- Database connection issues
- Calculation errors

## Example Usage

```javascript
// Frontend sends all selected answers at once
const response = await fetch('/evaluation/calculate-simple-progress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tenantId: 1,
    phaseName: "Planungs- und Logistikphase",
    subphaseName: "Materialbeschaffung",
    questionId: 1,
    questionText: "Wie strukturieren Sie Ihren Materialbeschaffungsprozess?",
    selectedAnswers: [
      // All selected answers with their metadata
    ]
  })
});

const result = await response.json();
console.log(`Level: ${result.calculatedLevel}`);
console.log(`Stage: ${result.calculatedStage}`);
console.log(`Description: ${result.calculatedDescription}`);
console.log(`Total Points: ${result.totalPoints}`);
```

This simple API eliminates the need for progressive flow and allows the frontend to send all selected answers in one request, receiving back the calculated progress metrics. 