import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // // Finds a user by email (useful during authentication, etc.)
  // async findByEmail(email: string) {
  //   return this.userRepo.findOne({ where: { email } });
  // }

  // // Creates a new user (this is used by the AuthService during registration)
  // async create(userData: Partial<User>) {
  //   const user = this.userRepo.create(userData);
  //   return this.userRepo.save(user);
  // }

  // Other user-related operations can be added here (e.g., update profile)
}
