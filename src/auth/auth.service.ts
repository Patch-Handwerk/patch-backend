import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
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
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    //Check if the user exist or not in our database
    const userExist = await this.userDb.findOne({
      where: { email: dto.email },
    });
    if (userExist) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }
    // 2) hash his password
    const hashed = await bcrypt.hash(dto.password, 10);

    // 3) create user instance (not yet saved)
    const user = await this.userDb.create({ ...dto, password: hashed });

    // 4) generate a one-time verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 3600_000); // 24h from now

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;

    // 5) save the user (with token + expiry)
    this.userDb.save(user);

    // 6) send the “verify your email” link
    await this.emailService.sendVerificationLink(user.email, verificationToken);

    // 7) respond with created and check email to verify
    throw new HttpException(
      'User created – please check your email to verify.',
      HttpStatus.CREATED,
    );
  }

  async login(dto: LoginDto) {
    //Check if the user exist or not in our database
    const user = await this.userDb.findOne({ where: { email: dto.email } });

    //If user exist then here compare both user email and password, or if not in our db then throw an error
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If admin approve the request then this user_status will change it to 1 and then easily login.
    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    if (user.user_status === 0) {
      // admin approval flag
      throw new UnauthorizedException('Awaiting admin approval');
    }

    //Payload and token genearation here and then return to client
    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign({ payload });
    return {
      status: 'success',
      message: 'User logged in successfully',
      token,
    };
  }
  async forgotPassword(dto: ForgotPasswordDto) {
    //Check if the user exist or not in our database
    const findUser = await this.userDb.findOne({ where: { email: dto.email } });
    //If user not exist in our db then throw an error
    if (!findUser) {
      throw new NotFoundException('User doesnot exist');
    }
    //Generate reset token & reset expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600_000);

    findUser.resetToken = resetToken;
    findUser.resetTokenExpiry = resetTokenExpiry;
    await this.userDb.save(findUser);
    await this.emailService.sendResetLink(dto.email, findUser.resetToken);
    return { message: 'Password reset link sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userDb.findOne({
      where: { resetToken: dto.token },
    });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await this.userDb.save(user);

    return { message: 'Password has been reset successfully' };
  }

  async verifyEmail(token: string) {
    const user = await this.userDb.findOne({
      where: { verificationToken: token },
    });
    if (
      !user ||
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await this.userDb.save(user);

    return { message: 'Email successfully verified' };
  }
}
