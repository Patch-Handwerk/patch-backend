import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';   // <-- Import UserService
import { UserController } from './user.controller'; // <-- Import UserController

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],  // <-- Add UserService here
  controllers: [UserController], // <-- Add UserController here
})
export class UserModule {}
