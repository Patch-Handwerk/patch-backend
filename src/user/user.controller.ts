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
import { UserService } from './user.service';
import { GetUsersDto } from './dtos/get-users.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guards';
import { Role } from './enums/role.enum';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  getUsers(@Query() filterDto: GetUsersDto) {
    return this.userService.getUsers(filterDto);
  }

  @Post('user/:id')
  updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateUserStatusDto,
  ) {
    return this.userService.updateUserStatus(id, statusDto);
  }
}
