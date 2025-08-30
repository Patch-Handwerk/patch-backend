import { IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SimpleSelectedAnswerDto {
  @ApiProperty({
    description: 'Unique identifier for the selected answer',
    example: 1
  })
  @IsNumber()
  answerId: number;

  @ApiProperty({
    description: 'Text content of the selected answer',
    example: 'Strongly Agree'
  })
  @IsString()
  answerText: string;

  @ApiProperty({
    description: 'Points awarded for this answer selection',
    example: 5
  })
  @IsNumber()
  point: number;

  @ApiProperty({
    description: 'Current level of the user (optional)',
    example: 3,
    required: false
  })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiProperty({
    description: 'Current stage of the user (optional)',
    example: 'Intermediate',
    required: false
  })
  @IsOptional()
  @IsString()
  stage?: string;

  @ApiProperty({
    description: 'Additional description for the answer (optional)',
    example: 'This indicates a high level of agreement',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CalculateProgressDto {
  @ApiProperty({
    description: 'Name of the phase being evaluated',
    example: 'Phase 1: Initial Assessment'
  })
  @IsString()
  phaseName: string;

  @ApiProperty({
    description: 'Name of the subphase being evaluated',
    example: 'Technical Skills Assessment'
  })
  @IsString()
  subphaseName: string;

  @ApiProperty({
    description: 'Unique identifier for the question',
    example: 1
  })
  @IsNumber()
  questionId: number;

  @ApiProperty({
    description: 'Text content of the question being answered',
    example: 'How would you rate your technical skills?'
  })
  @IsString()
  questionText: string;

  @ApiProperty({
    description: 'Current level of the user (optional)',
    example: 3,
    required: false
  })
  @IsOptional()
  @IsNumber()
  currentLevel?: number;

  @ApiProperty({
    description: 'Array of selected answers for the question',
    type: [SimpleSelectedAnswerDto],
    example: [
      {
        answerId: 1,
        answerText: 'Strongly Agree',
        point: 5,
        level: 3,
        stage: 'Intermediate',
        description: 'High level of agreement'
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SimpleSelectedAnswerDto)
  selectedAnswers: SimpleSelectedAnswerDto[];
} 