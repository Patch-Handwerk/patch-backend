import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guards';
import { GetUsersDto } from './dtos/get-users.dto';
import { AdminService } from './admin.service';
import { Role } from 'src/admin/enums/role.enum';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get all users with optional filters' })
  @ApiResponse({ status: 200, description: 'List of users returned successfully.' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter users by status' })
  @ApiQuery({ name: 'role', required: false, description: 'Filter users by role' })
  @Get('users')
  getUsers(@Query() filterDto: GetUsersDto) {
    return this.adminService.getUsers(filterDto);
  }

  @ApiOperation({ summary: 'Update a user\'s status (approve/reject)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UpdateUserStatusDto, description: 'Status update payload' })
  @Post('user/:id')
  updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, statusDto);
  }
}
