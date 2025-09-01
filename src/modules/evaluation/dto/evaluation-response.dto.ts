import { ApiProperty } from '@nestjs/swagger';

export class PhaseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Phase 1: Initial Assessment' })
  name: string;

  @ApiProperty({ example: 'Basic evaluation of current state' })
  description: string;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-08-30T01:39:34.123Z' })
  createdAt: string;
}

export class SubphaseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Technical Skills Assessment' })
  name: string;

  @ApiProperty({ example: 'Assessment of technical capabilities' })
  description: string;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 1 })
  phaseId: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-08-30T01:39:34.123Z' })
  createdAt: string;
}

export class AnswerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Strongly Agree' })
  text: string;

  @ApiProperty({ example: 5 })
  point: number;

  @ApiProperty({ example: 1 })
  questionId: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-08-30T01:39:34.123Z' })
  createdAt: string;
}

export class QuestionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'How would you rate your technical skills?' })
  text: string;

  @ApiProperty({ example: 'Technical Skills' })
  category: string;

  @ApiProperty({ example: 1 })
  subphaseId: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: [AnswerResponseDto] })
  answers: AnswerResponseDto[];

  @ApiProperty({ example: '2025-08-30T01:39:34.123Z' })
  createdAt: string;
}

export class ProgressResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Phase 1: Initial Assessment' })
  phaseName: string;

  @ApiProperty({ example: 'Technical Skills Assessment' })
  subphaseName: string;

  @ApiProperty({ example: 1 })
  questionId: number;

  @ApiProperty({ example: 15 })
  totalPoints: number;

  @ApiProperty({ example: 3 })
  currentLevel: number;

  @ApiProperty({ example: 'Intermediate' })
  stage: string;

  @ApiProperty({ example: 75 })
  progress: number;

  @ApiProperty({ example: '2025-08-30T01:39:34.123Z' })
  createdAt: string;
}

export class CompletePhaseResponseDto extends PhaseResponseDto {
  @ApiProperty({ type: [SubphaseResponseDto] })
  subphases: SubphaseResponseDto[];
}

export class CompleteSubphaseResponseDto extends SubphaseResponseDto {
  @ApiProperty({ type: [QuestionResponseDto] })
  questions: QuestionResponseDto[];
}

export class CompleteAssessmentResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Complete assessment data retrieved successfully' })
  message: string;

  @ApiProperty({ 
    type: 'array',
    items: { $ref: '#/components/schemas/CompletePhaseResponseDto' }
  })
  data: CompletePhaseResponseDto[];
}

export class UserProgressResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'User progress retrieved successfully' })
  message: string;

  @ApiProperty({ 
    type: 'array',
    items: { $ref: '#/components/schemas/ProgressResponseDto' }
  })
  data: ProgressResponseDto[];
}

export class CalculateProgressResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Progress calculated and stored successfully' })
  message: string;

  @ApiProperty({ type: ProgressResponseDto })
  data: ProgressResponseDto;
}
