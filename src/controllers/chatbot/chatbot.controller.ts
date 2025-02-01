import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ChatbotService } from '../../modules/chatbot/services/chatbot.service';
import { ChatRequest } from '../../modules/chatbot/interfaces/chatRequest';
import { ChatResponse } from '../../modules/chatbot/interfaces/chatResponse';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../../guards/jwt-guard';
import { GetUser } from '../../decorators/auth/get-user.decorator';
import { Message, Conversation, User } from '@prisma/client';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('send-message/:botId/:conversationId?/:stepId?')
  async sendMessage(
    @GetUser() user: User,
    @Body() chatRequest: ChatRequest,
    @Param('botId') botId: string,
    @Param('conversationId') conversationId?: string,
    @Param('stepId') stepId?: number,
  ): Promise<ChatResponse> {
    const { botMessage, conversationId: newConversationId } =
      await this.chatbotService.getModelAnswer(
        user.id,
        conversationId ? +conversationId : null,
        +botId,
        stepId || null,
        {
          messages: chatRequest.messages,
        },
      );

    return {
      success: true,
      result: botMessage,
      conversationId: newConversationId,
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get('conversation')
  async get_conversations(@GetUser() user: User): Promise<Conversation[]> {
    return this.chatbotService.get_conversations(user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get('conversation/:conversationId')
  async get_messages(
    @Param('conversationId') conversationId: string,
    @GetUser() user: User,
  ): Promise<Message[]> {
    return this.chatbotService.get_messages(user.id, +conversationId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get('suggestion')
  async getConversationStarter(): Promise<string[]> {
    const suggestions = await this.chatbotService.getSuggestion();
    return suggestions;
  }
}
