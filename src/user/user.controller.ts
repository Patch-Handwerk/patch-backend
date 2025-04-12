import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from './role.enum';
import { RolesGuard } from 'src/guards/roles.guards';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guards';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('pending')
  @Roles(Role.Admin)
  findPendingUsers() {
    return this.userService.findPendingUsers();
  }

  @Patch('approve/:id')
  @Roles(Role.Admin)
  approve(@Param('id') id: number) {
    return this.userService.approveUser(id);
  }

  @Patch('reject/:id')
  @Roles(Role.Admin)
  reject(@Param('id') id: number) {
    return this.userService.rejectUser(id);
  }
}
