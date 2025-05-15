import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonaDto } from '../../persona/dto/persona.dto';

export enum MessageRole {
  USER = 'user',
  PERSONA = 'persona',
}

export class MessageDto {
  @ApiProperty({
    description: 'The role of the message sender',
    enum: MessageRole,
    example: MessageRole.USER,
  })
  @IsEnum(MessageRole)
  role: MessageRole;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Can you tell me more about your sustainability practices?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'The current message being sent',
    type: MessageDto,
  })
  @ValidateNested()
  @Type(() => MessageDto)
  message: MessageDto;

  @ApiProperty({
    description: 'The persona participating in the chat',
    type: PersonaDto,
  })
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto;

  @ApiProperty({
    description: 'The name of the company',
    example: 'EcoTech Solutions',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'The history of previous messages',
    type: [MessageDto],
  })
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messageHistory: MessageDto[];
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'The response message from the persona',
    example: 'Thank you for explaining that. Can you tell me more about your manufacturing process?',
  })
  response: string;
}