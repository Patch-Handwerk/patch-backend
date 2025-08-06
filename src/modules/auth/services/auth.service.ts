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
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/modules/email';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dto';
import { User } from 'src/database/entities';
import { UserStatus, Role } from 'src/modules/admin/enums';

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
    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_token_expiry = new Date(Date.now() + 24 * 3600_000); // 24h from now

    user.verification_token = verification_token;
    user.verification_token_expiry = verification_token_expiry;

    // 5) save the user (with token + expiry)
    await this.userDb.save(user);

    // 6) send the “verify your email” link
    await this.emailService.sendVerificationLink(user.email, verification_token);

    // 7) respond with created and check email to verify
    throw new HttpException(
      'User created – please check your email to verify.',
      HttpStatus.CREATED,
    );
  }

  async login(dto: LoginDto) {
    // Define admin email (and optionally password) from env
    const adminName = this.configService.get<string>('ADMIN_NAME');
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<any>('ADMIN_PASSWORD');

    let user = await this.userDb.findOne({ where: { email: dto.email } });

    // If admin tries to login and does not exist, create admin user on the fly
    if (dto.email === adminEmail) {
      // Always check password against .env admin password
      if (dto.password !== adminPassword) {
        throw new UnauthorizedException('Invalid admin credentials');
      }
      if (!user) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        user = this.userDb.create({
          name: adminName,
          email: adminEmail,
          password: hashed,
          role: Role.ADMIN,
          is_verified: true,
          user_status: UserStatus.APPROVED,
        });
        await this.userDb.save(user);
        // Fetch the user again from DB to ensure all fields are present
        user = await this.userDb.findOne({ where: { email: adminEmail } });
      }
      // Compare password
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // Admin skips all checks
    } else {
      // Normal user login flow
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      if (!user.is_verified) {
        throw new UnauthorizedException('Email not verified');
      }
      if (user.user_status === UserStatus.PENDING) {
        throw new UnauthorizedException('Awaiting admin approval');
      }
      if (user.user_status === UserStatus.REJECTED) {
        throw new UnauthorizedException('Admin Rejected this user already');
      }
    }

    //Payload and tokens generation (access and refresh) and then return to client
    const payload = { id: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
    });

    // Hash & store refresh token in DB
    const hashed = await bcrypt.hash(refresh_token, 10);
    await this.userDb.update(user.id, { refresh_token: hashed });

    function getUserDetails(user: any) {
      const {
        password,
        accessToken,
        refresh_token,
        reset_token,
        verification_token,
        ...remainingFields
      } = user;
      return remainingFields;
    }

    const publicUser = getUserDetails(user);

    return {
      status: 'success',
      message: 'User logged in successfully',
      publicUser,
      accessToken,
      refresh_token,
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
    const reset_token = crypto.randomBytes(32).toString('hex');
    const reset_token_expiry = new Date(Date.now() + 3600_000);

    findUser.reset_token = reset_token;
    findUser.reset_token_expiry = reset_token_expiry;
    await this.userDb.save(findUser);
    await this.emailService.sendResetLink(dto.email, findUser.reset_token);
    return { message: 'Password reset link sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userDb.findOne({
      where: { reset_token: dto.token },
    });
    if (!user || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.reset_token = null;
    user.reset_token_expiry = null;
    await this.userDb.save(user);

    return { message: 'Password has been reset successfully' };
  }

  async verifyEmail(token: string) {
    console.log(token, 'token');
    const user = await this.userDb.findOne({
      where: { verification_token: token },
    });
    if (
      !user ||
      !user.verification_token_expiry ||
      user.verification_token_expiry < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.is_verified = true;
    user.verification_token = null;
    user.verification_token_expiry = null;
    await this.userDb.save(user);

    return { message: 'Email successfully verified' };
  }

  async refresh(refresh_token: string) {
    console.log(refresh_token, 'refresCHeck');
    try {
      // 1) Verify the refresh token signature & expiry
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      console.log(payload, 'checkPayload');

      // 2) Find the user and ensure they have a stored (hashed) refresh token
      const user = await this.userDb.findOne({ where: { id: payload.id } });
      if (!user || !user.refresh_token) {
        throw new UnauthorizedException('Access Denied');
      }

      // 3) Compare the incoming token to the hashed one in DB
      const isMatch = await bcrypt.compare(refresh_token, user.refresh_token);
      console.log(isMatch, 'isMatch');
      if (!isMatch) {
        throw new UnauthorizedException('Access Denied');
      }

      // 4) Generate a new pair of tokens
      const newPayload = { id: user.id, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newrefresh_token = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
        ),
      });

      // 5) Hash & store the new refresh token
      const hashed = await bcrypt.hash(newrefresh_token, 10);
      await this.userDb.update(user.id, { refresh_token: hashed });

      // 6) Return freshly minted tokens
      return {
        accessToken: newAccessToken,
        refresh_token: newrefresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async logout(userId: number) {
    console.log(userId, 'userId');
    await this.userDb.update(userId, { refresh_token: null });
    return { message: 'Logged out successfully' };
  }
}
