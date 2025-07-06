import { IsEnum } from 'class-validator';
import { UserStatus } from '../enums';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  user_status: UserStatus;
}
