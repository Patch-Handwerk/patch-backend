import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailer: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendResetLink(email: string, token: string) {
    try {
      const backendUrl = this.configService.get<string>('PORT');
      const url = `${backendUrl}/reset-password?token=${token}`;
      
      await this.mailer.sendMail({
        to: email,
        subject: 'Testing for Password Reset Email',
        text: `Click here to reset your password: ${url}`,
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      });
      
      this.logger.log(`Password reset email sent to ${email}`);
      
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw new InternalServerErrorException('Failed to send password reset email');
    }
  }
  
  async sendVerificationLink(email: string, token: string) {
    try {
      const backendUrl = this.configService.get<string>('PORT');
      const url = `${backendUrl}/verify-email?token=${token}`;      
      await this.mailer.sendMail({
        to: email,
        subject: 'Please verify your email',
        html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`,
      });
      
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      throw new InternalServerErrorException('Failed to send verification email');
    }
  }
}
