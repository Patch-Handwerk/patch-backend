import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetPhasesDto {
  @ApiProperty({
    description: 'Optional filter for phase name',
    required: false,
    example: 'Planungs- und Logistikphase'
  })
  @IsOptional()
  @IsString()
  phaseName?: string;
}
