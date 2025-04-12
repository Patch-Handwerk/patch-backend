// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getPendingUsers() {
    return this.userRepo.find({ where: { isApproved: false } });
  }

  async approveUser(id: number) {
    await this.userRepo.update(id, { isApproved: true });
    return { message: 'User approved' };
  }

  async rejectUser(id: number) {
    await this.userRepo.delete(id);
    return { message: 'User rejected and removed' };
  }
}
