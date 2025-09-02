import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'User status',
    example: UserStatus.APPROVED,
    enum: UserStatus,
    enumName: 'UserStatus'
  })
  @IsNotEmpty()
  @IsEnum(UserStatus)
  user_status: UserStatus;
}
