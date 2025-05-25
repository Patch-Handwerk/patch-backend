import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { Role } from 'src/user/enums/role.enum';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guards';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('pending')
  @Roles(Role.ADMIN)
  getPendingUsers() {
    return this.adminService.getPendingUsers();
  }

  @Patch('approve/:id')
  @Roles(Role.ADMIN)
  approveUser(@Param('id') id: number) {
    return this.adminService.approveUser(+id);
  }

  @Patch('reject/:id')
  @Roles(Role.ADMIN)
  rejectUser(@Param('id') id: number) {
    return this.adminService.rejectUser(+id);
  }
}
