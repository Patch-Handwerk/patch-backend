import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
    ){}
    
    async register(dto: RegisterDto) {
        const hashed = await bcrypt.hash(dto.password, 10);

        const user = await this.userRepo.create({...dto, password:hashed})

        return this.userRepo.save(user);
    }

    async login(dto:LoginDto){///have issues with user.pass because it is not fetch in user
        const user = await this.userRepo.findOne({ where: { email: dto.email } });

        if(!user || !(await bcrypt.compare(dto.password, user.password))){
            throw new UnauthorizedException('Invalid credentials');
        }
        if (!user.isApproved) {
            throw new UnauthorizedException('User not approved by admin');
          }

        const payload = {id: user.id, role:user.role}
        const token = this.jwtService.sign(payload);

        return{accessToken: token, user};
    }
}
