import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GetUsersDto } from './dtos/get-users.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { UserStatus } from './enums/user.status.enum';
import { Role } from './enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(filter: GetUsersDto): Promise<User[]> {
    const { role, user_status } = filter;
    const query = this.userRepository.createQueryBuilder('user');

    if (role) query.andWhere('user.role = :role', { role });
    if (user_status !== undefined)
      query.andWhere('user.user_status = :user_status', { user_status });

    return query.getMany();
  }

  async updateUserStatus(id: number, statusDto: UpdateUserStatusDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    user.user_status = statusDto.user_status;
    return this.userRepository.save(user);
  }
}
