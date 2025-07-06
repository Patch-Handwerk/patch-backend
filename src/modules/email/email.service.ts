import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendResetLink(email: string, token: string) {
    const backendUrl = this.configService.get<string>('PORT');
    const url = `${backendUrl}/reset-password?token=${token}`;
    await this.mailer.sendMail({
      to: email,
      subject: 'Testing for Password Reset Email',
      text: `Click here to reset your password: ${url}`,
      html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
    });
    return {
      success: true,
    };
  }
  async sendVerificationLink(email: string, token: string) {
    const backendUrl = this.configService.get<string>('PORT');
    console.log(backendUrl,'backendUrl'); //check backendUrl is working???
    const url = `${backendUrl}/verify-email?token=${token}`;
    console.log(url,'url'); //check url is working???
    await this.mailer.sendMail({
      to: email,
      subject: 'Please verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`,
    });
  }
}
