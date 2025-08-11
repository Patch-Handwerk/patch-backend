import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetQuestionDto {
  @ApiProperty({
    description: 'ID of the subphase to get question for',
    example: 1
  })
  @IsNumber()
  subphaseId: number;

  @ApiProperty({
    description: 'Optional filter for specific answer level',
    required: false,
    example: 1
  })
  @IsOptional()
  @IsNumber()
  level?: number;
}
