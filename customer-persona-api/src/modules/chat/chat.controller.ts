import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat-message.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Get a response from the persona based on user message' })
  @ApiResponse({
    status: 200,
    description: 'Chat response generated successfully',
    type: ApiResponseDto,
  })
  async getChatResponse(@Body() chatRequestDto: ChatRequestDto): Promise<ApiResponseDto<ChatResponseDto>> {
    // Clean the persona object to ensure it only contains valid properties
    if (chatRequestDto.persona) {
      const { id, name, age, gender, location, jobTitle, interests, challenges, initialChallenge, knowledgeDomain, problemToSolve, temporaryContext } = chatRequestDto.persona;
      chatRequestDto.persona = { 
        id, name, age, gender, location, jobTitle, interests, challenges, initialChallenge, 
        knowledgeDomain, problemToSolve, temporaryContext 
      } as any;
    }
    
    const response = await this.chatService.generateResponse(chatRequestDto);
    return ApiResponseDto.success(response, 'Chat response generated successfully');
  }
  
  @Post('with-context')
  @ApiOperation({ summary: 'Get a response from the persona with additional context' })
  @ApiResponse({
    status: 200,
    description: 'Contextual chat response generated successfully',
    type: ApiResponseDto,
  })
  async getContextualChatResponse(@Body() chatRequestDto: ChatRequestDto & {
    additionalContext?: string;
  }): Promise<ApiResponseDto<ChatResponseDto>> {
    // Extract additional context if provided
    const { additionalContext, ...standardRequest } = chatRequestDto;
    
    // Clean the persona object to ensure it only contains valid properties
    if (standardRequest.persona) {
      const { id, name, age, gender, location, jobTitle, interests, challenges, initialChallenge, knowledgeDomain, problemToSolve } = standardRequest.persona;
      standardRequest.persona = { 
        id, name, age, gender, location, jobTitle, interests, challenges, initialChallenge, 
        knowledgeDomain, problemToSolve 
      } as any;
      
      // Add context to the persona object temporarily (won't be saved to DB)
      if (additionalContext) {
        standardRequest.persona.temporaryContext = additionalContext;
      }
    }
    
    const response = await this.chatService.generateResponse(standardRequest);
    return ApiResponseDto.success(response, 'Contextual chat response generated successfully');
  }
}