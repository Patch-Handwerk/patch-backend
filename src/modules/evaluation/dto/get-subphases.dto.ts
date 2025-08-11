import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetSubphasesDto {
  @ApiProperty({
    description: 'ID of the phase to get subphases for',
    example: 1
  })
  @IsNumber()
  phaseId: number;

  @ApiProperty({
    description: 'Optional filter for subphase name',
    required: false,
    example: 'Materialbeschaffung'
  })
  @IsOptional()
  @IsString()
  subphaseName?: string;
}
