import { ApiProperty } from '@nestjs/swagger';

export class AdminUserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'CONSULTANT', enum: ['CONSULTANT', 'CRAFTSMAN', 'ADMIN'] })
  role: string;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  user_status: string;

  @ApiProperty({ example: true })
  is_verified: boolean;

  @ApiProperty({ example: '2025-08-30T01:39:34.123Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-08-30T01:39:34.123Z' })
  updatedAt: string;
}

export class GetUsersResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Users retrieved successfully' })
  message: string;

  @ApiProperty({ 
    type: 'array',
    items: { $ref: '#/components/schemas/AdminUserResponseDto' }
  })
  data: AdminUserResponseDto[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

export class UpdateUserStatusResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'User status updated successfully' })
  message: string;

  @ApiProperty({ type: AdminUserResponseDto })
  data: AdminUserResponseDto;
}
