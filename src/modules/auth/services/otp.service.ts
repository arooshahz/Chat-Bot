import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { EmailService } from 'src/modules/email/services/email.service';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {
  }

  async requsetOtp(email) {
    await this.prisma.oTP.deleteMany({
      where: {
        email: email,
      },
    });

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_TTL) * 60000,
    );

    await this.prisma.oTP.create({
      data: {
        code: otpCode,
        email: email,
        expiresAt: expiresAt,
      },
    });

    await this.emailService.sendEmail(
      email,
      'Hoperise Verification Code',
      'otp-verification-email',
      { email: email, code: otpCode },
    );
  }

  async checkOtp(email: string, code: string) {
    const otp = await this.prisma.oTP.findFirst({
      where: {
        email: email,
        code: code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    if (!otp) {
      return false;
    }
    return true;
  }

  async verifyOtp(email: string, code: string) {
    const otp = await this.prisma.oTP.findFirst({
      where: {
        email: email,
        code: code,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    if (!otp) {
      return false;
    }

    await this.prisma.oTP.update({
      where: {
        id: otp.id,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    return true;
  }
}
