import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'consultant', enum: ['CONSULTANT', 'CRAFTSMAN' , 'ADMIN'] })
  role: string;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  status: string;

  @ApiProperty({ example: '2025-08-30T01:39:34.123Z' })
  createdAt: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzMDM5MzQzNCwiZXhwIjoxNjMwMzk3MDM0fQ.example',
    description: 'JWT access token for API authentication'
  })
  accessToken: string;

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzMDM5MzQzNCwiZXhwIjoxNjMwNDU4MjM0fQ.example',
    description: 'JWT refresh token for getting new access tokens'
  })
  refreshToken: string;
}

export class RegisterResponseDto extends UserResponseDto {
  @ApiProperty({ example: 'PENDING' })
  declare status: string;
}

export class GetAllUsersResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Users retrieved successfully' })
  message: string;

  @ApiProperty({ 
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'John Doe' },
        role: { type: 'string', example: 'consultant' },
        user_status: { type: 'string', example: 'pending' },
        is_verified: { type: 'boolean', example: false }
      }
    }
  })
  data: any[];
}

export class ForgotPasswordResponseDto {
  @ApiProperty({ example: 'Password reset link sent' })
  message: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({ example: 'Password has been reset successfully' })
  message: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({ example: 'Email successfully verified' })
  message: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzMDM5MzQzNCwiZXhwIjoxNjMwMzk3MDM0fQ.example',
    description: 'New JWT access token'
  })
  accessToken: string;

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzMDM5MzQzNCwiZXhwIjoxNjMwNDU4MjM0fQ.example',
    description: 'New JWT refresh token'
  })
  refresh_token: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logged out successfully' })
  message: string;
}
