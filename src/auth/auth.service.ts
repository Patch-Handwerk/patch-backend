import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
        const userExist = await this.userRepo.findOne({ where: { email: dto.email } });
        if(userExist) {
            throw new HttpException('user already exist', HttpStatus.BAD_REQUEST); ;
        }

        const user = await this.userRepo.create({...dto, password:hashed})
        
        this.userRepo.save(user);

        throw new HttpException('User created successfully', HttpStatus.CREATED) ;
    }

    async login(dto:LoginDto){

        //Check if the user exist or not in our database
        const user = await this.userRepo.findOne({ where: { email: dto.email } });

        //If user exist then here compare both user email and password, or if not in our db then throw an error
        if(!user || !(await bcrypt.compare(dto.password, user.password))){
            throw new UnauthorizedException('Invalid credentials');
        }

        // If admin approve the request then this user_status will change it to 1 and then easily login.
        if (user.user_status == 0) {
            throw new UnauthorizedException('User not approved by admin');
          }

        //Payload and token genearation here and then return to client
        const payload = {id: user.id, role:user.role}
        const token = this.jwtService.sign({payload});
        return {
            status: 'success',
            message: "User logged in successfully",
            token
        }
    }
}
