import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers:[UserController],
  exports: [UserService], // Exporting UserService for use in other modules, e.g., Auth
})
export class UserModule {}
