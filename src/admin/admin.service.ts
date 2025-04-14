import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    return this.userRepo.find({ where: { isApproved: false } });
  }

  // Approves a user by setting isApproved to true
  async approveUser(id: number) {
    const result = await this.userRepo.update(id, { isApproved: true });
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
