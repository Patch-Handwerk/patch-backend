import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userDb: Repository<User>,
        private readonly jwtService: JwtService,
        private emailService: EmailService
    ){}
    
    async register(dto: RegisterDto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const userExist = await this.userDb.findOne({ where: { email: dto.email } });
        if(userExist) {
            throw new HttpException('user already exist', HttpStatus.BAD_REQUEST); ;
        }

        const user = await this.userDb.create({...dto, password:hashed})
        
        this.userDb.save(user);

        throw new HttpException('User created successfully', HttpStatus.CREATED) ;
    }

    async login(dto:LoginDto){

        //Check if the user exist or not in our database
        const user = await this.userDb.findOne({ where: { email: dto.email } });

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
    async forgotPassword(dto: ForgotPasswordDto){
         //Check if the user exist or not in our database
        const findUser = await this.userDb.findOne({where: {email:dto.email}});
         //If user not exist in our db then throw an error
        if(!findUser) {
            throw new NotFoundException('User doesnot exist');
        }
        //Generate reset token & reset expiry (1 hour)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now()+3600_000);

        findUser.resetToken = resetToken;
        findUser.resetTokenExpiry = resetTokenExpiry;
        await this.userDb.save(findUser);
        await this.emailService.sendResetLink(dto.email, findUser.resetToken);
        return { message: 'Password reset link sent' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.userDb.findOne({ where: { resetToken: dto.token } });
        if (
          !user ||
          !user.resetTokenExpiry ||
          user.resetTokenExpiry < new Date()
        ) {
          throw new BadRequestException('Invalid or expired reset token');
        }
    
        user.password = await bcrypt.hash(dto.newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await this.userDb.save(user);
    
        return { message: 'Password has been reset successfully' };
      }
}
