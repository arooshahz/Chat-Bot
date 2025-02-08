import { BadRequestException, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/services/prisma.service';
import { OpenAiChatRoleEnum } from '../enums/openai-chat-role.enum';
import { ConversationTypeEnum } from '../enums/conversation-type.enum';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ChatbotService {
  private provider: OpenAI;
  private model: string;

  constructor(private prisma: PrismaService) {}

  async getSuggestion() {
    const configPath = path.join(
      __dirname,
      '../../../../src/config/conversation-starters.json',
    );
    const configFile = fs.readFileSync(configPath, 'utf8');
    const configData = JSON.parse(configFile);
    const suggestions = configData.starters;
    return suggestions;
  }

  private async initializeProvider(
    providerToken: string,
    providerModel: string,
  ) {
    this.provider = new OpenAI({
      apiKey: providerToken,
    });
    this.model = providerModel;
  }

  async getModelAnswer(
    userId: number,
    conversationId: number,
    botId: number,
    stepId: number | null,
    inputs: { messages: Array<{ role: OpenAiChatRoleEnum; content: string }> },
  ) {
    const bot = await this.prisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot) {
      throw new Error('Bot not found.');
    }
    const provider = await this.prisma.botProvider.findUnique({
      where: { id: bot.providerId },
    });
    if (!provider) {
      throw new Error('Provider not found for the selected bot.');
    }
    await this.initializeProvider(provider.token, provider.model);
    const response = await this.provider.chat.completions.create({
      model: this.model ?? 'gpt-3.5-turbo',
      messages: inputs.messages,
    });
    const userMessage = inputs.messages.find(
      (message) => message.role === OpenAiChatRoleEnum.USER,
    );
    if (!userMessage) {
      throw new Error('User message not found.');
    }
    if (!conversationId) {
      const conversation = await this.prisma.conversation.create({
        data: {
          conversationType: ConversationTypeEnum.BOT,
          title: 'Chat with Bot',
          stepId: stepId || null,
        },
      });
      conversationId = conversation.id;
      await this.findOrCreateParticipant(conversation.id, userId, 'user');
      await this.findOrCreateParticipant(conversation.id, bot.id, 'bot');
    } else {
      const conversation = await this.prisma.conversation.findFirst({
        where: {
          Participants: {
            some: {
              userId: userId,
            },
          },
        },
      });
      if (!conversation) {
        throw new BadRequestException(
          'You are not a participant in this conversation.',
        );
      }
    }
    await this.saveMessage(conversationId, userId, userMessage.content);
    const botMessage = response.choices[0]?.message?.content;
    await this.saveMessage(conversationId, bot.id, botMessage);
    return {
      conversationId,
      botMessage,
    };
  }



  // async checkMessageLimit(userId: number): Promise<boolean> {
  //   const userLimit = await this.prisma.userMessageLimit.findUnique({
  //     where: { userId },
  //   });
  //
  //   if (!userLimit || userLimit.messageLimit === null) {
  //     return true;
  //   }
  //
  //   // اگر تاریخ ریست گذشته، محدودیت رو ریست کن
  //   const now = new Date();
  //   if (now > userLimit.resetDate) {
  //     await this.prisma.userMessageLimit.update({
  //       where: { userId },
  //       data: { usedMessages: 0, resetDate: now },
  //     });
  //     return true;
  //   }
  //
  //   // اگر تعداد پیام‌های استفاده شده از محدودیت بیشتر شده
  //   if (userLimit.usedMessages >= userLimit.messageLimit) {
  //     return false; // اجازه ارسال پیام نده
  //   }
  //
  //   return true; // اجازه ارسال پیام بده
  // }


  private async findOrCreateParticipant(
    conversationId: number,
    userId: number | null,
    role: 'user' | 'bot',
  ) {
    const participant = await this.prisma.participant.findFirst({
      where: {
        conversationId,
        userId: userId || undefined,
        role,
      },
    });

    if (participant) {
      return participant;
    }

    return this.prisma.participant.create({
      data: {
        conversationId,
        userId: role === 'user' ? userId : null,
        botId: role === 'bot' ? userId : null,
        role,
      },
    });
  }

  private async saveMessage(
    conversationId: number,
    participantId: number | null,
    content: string,
  ) {
    return this.prisma.message.create({
      data: {
        conversationId,
        participantId,
        content,
      },
    });
  }

  async get_conversations(userId: number) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        Participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        Participants: true,
        Messages: {
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    return conversations;
  }

  async get_messages(userId: number, conversationId: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        Participants: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!conversation) {
      throw new BadRequestException(
        'You are not a participant in this conversation.',
      );
    }

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return messages;
  }
}

