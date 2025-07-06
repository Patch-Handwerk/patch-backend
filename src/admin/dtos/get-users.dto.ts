import { IsOptional, IsEnum } from 'class-validator';
import { Role } from 'src/admin/enums/role.enum';
import { UserStatus } from 'src/admin/enums/user.status.enum';

export class GetUsersDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(UserStatus)
  user_status?: UserStatus;
}
