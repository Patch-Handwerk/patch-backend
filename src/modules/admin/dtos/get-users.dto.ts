import { IsOptional, IsEnum } from 'class-validator';
import { Role, UserStatus } from '../enums';

export class GetUsersDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(UserStatus)
  user_status?: UserStatus;
}
