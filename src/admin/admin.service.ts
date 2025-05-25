import {Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from 'src/user/enums/user.status.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Returns all users that are pending approval (isApproved false)
  async getPendingUsers() {
     const getUser = await this.userRepo.find({ where: {isVerified:true, user_status: UserStatus.PENDING } });
     return getUser;
  }

  // Approves a user by setting isApproved to true
  async approveUser(id: number) {
    const result = await this.userRepo.update(id, { user_status: UserStatus.APPROVED });
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { message: 'User approved' };
  }

  // Rejects a user by deleting them from the database
  async rejectUser(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { message: 'User rejected and removed' };
  }
}
