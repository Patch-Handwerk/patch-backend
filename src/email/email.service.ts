import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    constructor(private readonly mailer: MailerService) {}

    async sendResetLink(email:string, token: string){
      console.log("token check", token);
        const url = `https://check.com/reset-password?token=${token}`;
        await this.mailer.sendMail({
          to: email,
          subject: 'Testing for Password Reset Email',
          text: `Click here to reset your password: ${url}`,
          html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
        });
        return {
          success: true,
        }
    }
}