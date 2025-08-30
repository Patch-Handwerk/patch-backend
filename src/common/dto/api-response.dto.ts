import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable message about the operation result',
    example: 'Operation completed successfully'
  })
  message: string;

  @ApiProperty({
    description: 'The actual data returned by the operation',
    example: {}
  })
  data?: T;

  @ApiProperty({
    description: 'Error details if the operation failed',
    example: null,
    required: false
  })
  error?: string;

  @ApiProperty({
    description: 'Timestamp when the response was generated',
    example: '2025-08-30T01:39:34.123Z'
  })
  timestamp: string;
}

export class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10
    }
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
