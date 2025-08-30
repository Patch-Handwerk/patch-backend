import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../enums';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'New status for the user',
    example: 'ACTIVE',
    enum: UserStatus,
    enumName: 'UserStatus'
  })
  @IsEnum(UserStatus)
  user_status: UserStatus;
}
