import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role, UserStatus } from '../enums';

export class GetUsersDto {
  @ApiProperty({
    description: 'Filter users by role',
    example: 'USER',
    enum: Role,
    required: false
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'Filter users by status',
    example: 'ACTIVE',
    enum: UserStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(UserStatus)
  user_status?: UserStatus;
}
