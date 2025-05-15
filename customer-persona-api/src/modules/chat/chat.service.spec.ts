import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { ChatMessage } from './entities/chat-message.entity';
import { PersonaService } from '../persona/persona.service';
import { OpenAIService } from '../../config/openai.config';
import { MessageRole } from './dto/chat-message.dto';

const mockChatMessageRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

const mockPersonaService = () => ({
  getPersonaById: jest.fn(),
});

const mockOpenAIService = () => ({
  generateChatResponse: jest.fn(),
});

describe('ChatService', () => {
  let service: ChatService;
  let chatMessageRepository;
  let configService;
  let personaService;
  let openAIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(ChatMessage),
          useFactory: mockChatMessageRepository,
        },
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
        {
          provide: PersonaService,
          useFactory: mockPersonaService,
        },
        {
          provide: OpenAIService,
          useFactory: mockOpenAIService,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatMessageRepository = module.get(getRepositoryToken(ChatMessage));
    configService = module.get<ConfigService>(ConfigService);
    personaService = module.get<PersonaService>(PersonaService);
    openAIService = module.get<OpenAIService>(OpenAIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateResponse', () => {
    it('should generate a response using OpenAI when API key is available', async () => {
      // Arrange
      const chatRequestDto = {
        message: { role: MessageRole.USER, content: 'Hello' },
        persona: {
          id: '123',
          name: 'John Doe',
          age: 30,
          gender: 'Male',
          location: 'New York',
          jobTitle: 'Software Engineer',
          interests: ['Technology'],
          challenges: ['Finding solutions'],
          initialChallenge: 'How can I help you?',
          knowledgeDomain: 'Technology',
          problemToSolve: 'Finding the right solution',
        },
        companyName: 'Test Company',
        messageHistory: [
          { role: MessageRole.PERSONA, content: 'How can I help you?' },
          { role: MessageRole.USER, content: 'I need information' },
        ],
      };
      
      const aiResponse = 'This is an AI-generated response';
      
      configService.get.mockReturnValue('fake-api-key');
      openAIService.generateChatResponse.mockResolvedValue(aiResponse);
      chatMessageRepository.create.mockReturnValue({ 
        role: MessageRole.USER, 
        content: 'Hello',
        personaId: '123' 
      });
      chatMessageRepository.save.mockResolvedValue({
        id: '456',
        role: MessageRole.USER,
        content: 'Hello',
        personaId: '123',
      });

      // Act
      const result = await service.generateResponse(chatRequestDto as any);

      // Assert
      expect(configService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
      expect(openAIService.generateChatResponse).toHaveBeenCalledWith(
        chatRequestDto.persona,
        chatRequestDto.companyName,
        chatRequestDto.message.content,
        expect.any(Array)
      );
      expect(chatMessageRepository.create).toHaveBeenCalledTimes(2);
      expect(chatMessageRepository.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ response: aiResponse });
    });

    it('should generate a mock response when OpenAI API key is not available', async () => {
      // Arrange
      const chatRequestDto = {
        message: { role: MessageRole.USER, content: 'Hello' },
        persona: {
          id: '123',
          name: 'John Doe',
          age: 30,
          gender: 'Male',
          location: 'New York',
          jobTitle: 'Software Engineer',
          interests: ['Technology'],
          challenges: ['Finding solutions'],
          initialChallenge: 'How can I help you?',
          knowledgeDomain: 'Technology',
          problemToSolve: 'Finding the right solution',
        },
        companyName: 'Test Company',
        messageHistory: [],
      };
      
      configService.get.mockReturnValue(null);
      chatMessageRepository.create.mockReturnValue({ 
        role: MessageRole.USER, 
        content: 'Hello',
        personaId: '123' 
      });
      chatMessageRepository.save.mockResolvedValue({
        id: '456',
        role: MessageRole.USER,
        content: 'Hello',
        personaId: '123',
      });

      // Act
      const result = await service.generateResponse(chatRequestDto as any);

      // Assert
      expect(configService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
      expect(openAIService.generateChatResponse).not.toHaveBeenCalled();
      expect(chatMessageRepository.create).toHaveBeenCalledTimes(2);
      expect(chatMessageRepository.save).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('response');
      expect(typeof result.response).toBe('string');
    });
  });

  describe('saveMessage', () => {
    it('should save a message to the database', async () => {
      // Arrange
      const message = { role: MessageRole.USER, content: 'Test message' };
      const personaId = '123';
      const savedMessage = { 
        id: '456', 
        role: MessageRole.USER, 
        content: 'Test message',
        personaId: '123' 
      };
      
      chatMessageRepository.create.mockReturnValue({ ...message, personaId });
      chatMessageRepository.save.mockResolvedValue(savedMessage);

      // Act
      const result = await service['saveMessage'](message, personaId);

      // Assert
      expect(chatMessageRepository.create).toHaveBeenCalledWith({
        ...message,
        personaId,
      });
      expect(chatMessageRepository.save).toHaveBeenCalledWith({
        ...message,
        personaId,
      });
      expect(result).toEqual(savedMessage);
    });
  });
});