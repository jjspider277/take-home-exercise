import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatMessage } from './entities/chat-message.entity';
import { PersonaModule } from '../persona/persona.module';
import { OpenAIService } from '../../config/openai.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage]),
    PersonaModule
  ],
  controllers: [ChatController],
  providers: [ChatService, OpenAIService],
})
export class ChatModule {}