import { IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SimpleSelectedAnswerDto {
  @IsNumber()
  answerId: number;

  @IsString()
  answerText: string;

  @IsNumber()
  point: number;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CalculateProgressDto {
  @IsNumber()
  tenantId: number;

  @IsString()
  phaseName: string;

  @IsString()
  subphaseName: string;

  @IsNumber()
  questionId: number;

  @IsString()
  questionText: string;

  @IsOptional()
  @IsNumber()
  currentLevel?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SimpleSelectedAnswerDto)
  selectedAnswers: SimpleSelectedAnswerDto[];
} 