import { OpenAiChatRoleEnum } from '../enums/openai-chat-role.enum';

export interface ChatRequest {
  messages: Array<{ role: OpenAiChatRoleEnum; content: string }>;
}
