import { Module } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { GoogleStrategy } from '../../strategies/google.strategy';
// import { OAuthService } from './services/oauth.service';

@Module({
  imports: [PrismaModule, UserModule, EmailModule],
  providers: [OtpService, JwtStrategy, GoogleStrategy],
  exports: [OtpService],
})
export class AuthModule {}
