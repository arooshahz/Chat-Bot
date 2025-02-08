import { Module } from '@nestjs/common';
import { ChatbotService } from './services/chatbot.service';
import { ChatbotController } from 'src/controllers/chatbot/chatbot.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
