import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserAdminService } from './services/userAdmin.service';
import { ChatbotModule } from '../chatbot/chatbot.module';

@Module({
  imports: [PrismaModule, ChatbotModule],
  providers: [UserService, UserAdminService],
  exports: [UserService, UserAdminService],
})
export class UserModule {}
