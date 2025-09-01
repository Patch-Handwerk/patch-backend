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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Role } from '../enums';
import { Roles, RolesGuard } from 'src/common';
import { UpdateUserStatusDto, GetUsersDto } from '../dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from '../services';

@ApiTags('admin') 
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get all users with optional filters
  @ApiOperation({ 
    summary: 'Get all users with optional filters',
    description: 'Retrieves a list of all users in the system with optional filtering by status and role. This endpoint is restricted to admin users only.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin access required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter users by status (PENDING, ACTIVE, INACTIVE)',
    example: 'ACTIVE'
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter users by role (USER, ADMIN)',
    example: 'USER'
  })
  @Get('users')
  getUsers(@Query() filterDto: GetUsersDto) {
    return this.adminService.getUsers(filterDto);
  }

  // Update a user's status (approve/reject)
  @ApiOperation({ 
    summary: "Update a user's status (approve/reject)",
    description: 'Updates the status of a specific user. This endpoint allows admins to approve, reject, or deactivate user accounts. Only admin users can access this endpoint.'
  })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid status value or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin access required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID to update', example: 1 })
  @ApiBody({ type: UpdateUserStatusDto, description: 'Status update payload' })
  @Post('user/:id')
  updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, statusDto);
  }
}
