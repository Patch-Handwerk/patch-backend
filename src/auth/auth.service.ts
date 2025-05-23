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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userDb: Repository<User>,
    private readonly jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
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

    //Payload and tokens genearation (access and refresh) and then return to client
    const payload = { id: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
    });

    // 3) Hash & store refresh token in DB
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userDb.update(user.id, { refreshToken: hashed });

    function getUserDetails(user: any) {
      const {
        password,
        accessToken,
        refreshToken,
        resetToken,
        verificationToken,
        ...remainingFields
      } = user;
      return remainingFields;
    }

    // Usage
    const publicUser = getUserDetails(user);

    return {
      status: 'success',
      message: 'User logged in successfully',
      publicUser,
      accessToken,
      refreshToken,
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

  async refresh(refreshToken: string) {
    console.log(refreshToken, 'refresCHeck');
    try {
      // 1) Verify the refresh token signature & expiry
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      console.log(payload, 'checkPayload');

      // 2) Find the user and ensure they have a stored (hashed) refresh token
      const user = await this.userDb.findOne({ where: { id: payload.id } });
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      // 3) Compare the incoming token to the hashed one in DB
      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      console.log(isMatch, 'isMatch');
      if (!isMatch) {
        throw new UnauthorizedException('Access Denied');
      }

      // 4) Generate a new pair of tokens
      const newPayload = { id: user.id, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
        ),
      });

      // 5) Hash & store the new refresh token
      const hashed = await bcrypt.hash(newRefreshToken, 10);
      await this.userDb.update(user.id, { refreshToken: hashed });

      // 6) Return freshly minted tokens
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async logout(userId: number) {
    console.log(userId, 'userId');
    await this.userDb.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }
}
