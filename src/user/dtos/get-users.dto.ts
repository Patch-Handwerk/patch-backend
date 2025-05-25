import { IsOptional, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user.status.enum';
import { Transform } from 'class-transformer';

export class GetUsersDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(UserStatus)
  user_status?: UserStatus;
}
