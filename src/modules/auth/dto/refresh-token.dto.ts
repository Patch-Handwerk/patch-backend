// src/auth/dto/refresh-token.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token to get new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzMDM5MzQzNCwiZXhwIjoxNjMwNDU4MjM0fQ.example'
  })
  @IsString()
  refreshToken: string;
}
