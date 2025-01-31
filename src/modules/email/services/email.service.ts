import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, template: string, context: any) {



    const templatePath =  path.join(process.cwd(), 'src/views', 'otp-verification-email.ejs');
    // const templatePath = path.join('/dist/views', `${template}.ejs`);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const html = ejs.render(templateContent, context);
    
    await this.mailerService.sendMail({
      to: to,
      subject: subject,
      html: html,
    });
  }
}