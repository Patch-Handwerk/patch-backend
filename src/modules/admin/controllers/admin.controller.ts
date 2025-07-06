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
import { UpdateUserStatusDto, GetUsersDto } from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from '../services';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get all users with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter users by status',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter users by role',
  })
  @Get('users')
  getUsers(@Query() filterDto: GetUsersDto) {
    return this.adminService.getUsers(filterDto);
  }

  @ApiOperation({ summary: "Update a user's status (approve/reject)" })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully.',
  })
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
