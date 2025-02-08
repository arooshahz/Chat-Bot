import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
//modules
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

//controllers
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { UserController } from './controllers/user/user.controller';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { UserAdminController } from './controllers/user/userAdmin.controller';
import { ChatbotModule } from "./modules/chatbot/chatbot.module";
import { ChatbotController } from './controllers/chatbot/chatbot.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    OnboardingModule,
    UserModule,
    ChatbotModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    UserAdminController,
  ],
  providers: [AppService],
})
export class AppModule {}
