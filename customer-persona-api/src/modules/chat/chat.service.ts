import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ChatRequestDto, ChatResponseDto, MessageRole } from './dto/chat-message.dto';
import { ChatMessage } from './entities/chat-message.entity';
import { PersonaService } from '../persona/persona.service';
import { OpenAIService } from '../../config/openai.config';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private readonly configService: ConfigService,
    private readonly personaService: PersonaService,
    private readonly openAIService: OpenAIService,
  ) { }

  async generateResponse(chatRequestDto: ChatRequestDto): Promise<ChatResponseDto> {
    const { message, persona, companyName, messageHistory } = chatRequestDto;

    // Save the user message to the database
    await this.saveMessage(message, persona.id);

    let responseContent = '';

    try {
      // Try to use OpenAI if configured
      const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
      console.log('OpenAI API Key:', openaiApiKey);

      if (openaiApiKey) {
        // Convert message history to the format expected by OpenAI
        const conversationHistory = messageHistory.map(msg => ({
          role: msg.role === MessageRole.USER ? 'user' : 'assistant',
          content: msg.content,
        }));

        // Get response from OpenAI using the enhanced persona-based system
        responseContent = await this.openAIService.generateChatResponse(
          persona,
          companyName,
          message.content,
          conversationHistory,
        );
      } else {
        // Fall back to mock responses if no API key
        responseContent = this.generateMockResponse(persona, companyName, messageHistory.length).response;
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fall back to mock response on error
      responseContent = this.generateMockResponse(persona, companyName, messageHistory.length).response;
    }

    // Save the persona's response to the database
    await this.saveMessage({
      role: MessageRole.PERSONA,
      content: responseContent,
    }, persona.id);

    return { response: responseContent };
  }

  private async saveMessage(message: { role: MessageRole; content: string }, personaId: string): Promise<ChatMessage> {
    const chatMessage = this.chatMessageRepository.create({
      ...message,
      personaId,
    });

    return this.chatMessageRepository.save(chatMessage);
  }

  private generateMockResponse(persona: any, companyName: string, messageCount: number): ChatResponseDto {
    let response = '';
    const { name, knowledgeDomain, problemToSolve } = persona;
    // Use a default job title if it's missing to prevent null reference errors
    const jobTitle = persona.jobTitle || 'professional';

    // Use persona's knowledge domain and problem to create more specific responses
    if (messageCount === 1) {
      response = `Thank you for explaining that. As someone with experience in ${knowledgeDomain || 'this field'}, I'm particularly interested in how ${companyName} addresses ${problemToSolve || 'my specific needs'}. Could you elaborate on that aspect?`;
    } else if (messageCount === 3) {
      response = `That's really helpful information! Given my role as a ${jobTitle}, I'm curious about how ${companyName}'s solution compares to others I've researched. What would you say are your key differentiators?`;
    } else if (messageCount >= 5) {
      response = `I really appreciate all this information. You've addressed my concerns about ${problemToSolve || 'my needs'} quite thoroughly. I feel much better informed about how ${companyName} could work for someone in my position.`;
    } else {
      // More personalized generic fallback response
      response = `That's interesting information about ${companyName}. As someone focused on ${knowledgeDomain || 'this area'}, I'm wondering how specifically that would help with ${problemToSolve || 'the challenges I face'}?`;
    }

    return { response };
  }
}