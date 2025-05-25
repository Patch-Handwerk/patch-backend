import { IsEnum } from 'class-validator';
import { UserStatus } from '../enums/user.status.enum';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  user_status: UserStatus;
}
