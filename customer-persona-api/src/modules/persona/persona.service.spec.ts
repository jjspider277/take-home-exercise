import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PersonaService } from './persona.service';
import { Persona } from './entities/persona.entity';
import { CompanyService } from '../company/company.service';
import { OpenAIService } from '../../config/openai.config';
import { Repository } from 'typeorm';

const mockPersonaRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

const mockCompanyService = () => ({
  storeCompanyInfo: jest.fn(),
});

const mockOpenAIService = () => ({
  generatePersona: jest.fn(),
});

describe('PersonaService', () => {
  let service: PersonaService;
  let personaRepository;
  let configService;
  let companyService;
  let openAIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonaService,
        {
          provide: getRepositoryToken(Persona),
          useFactory: mockPersonaRepository,
        },
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
        {
          provide: CompanyService,
          useFactory: mockCompanyService,
        },
        {
          provide: OpenAIService,
          useFactory: mockOpenAIService,
        },
      ],
    }).compile();

    service = module.get<PersonaService>(PersonaService);
    personaRepository = module.get<Repository<Persona>>(getRepositoryToken(Persona));
    configService = module.get<ConfigService>(ConfigService);
    companyService = module.get<CompanyService>(CompanyService);
    openAIService = module.get<OpenAIService>(OpenAIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePersona', () => {
    it('should generate a persona using OpenAI when API key is available', async () => {
      // Arrange
      const companyDto = {
        name: 'Test Company',
        characteristics: ['Innovative', 'Tech-focused'],
      };
      const company = { id: '123', name: 'Test Company' };
      const personaData = {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        location: 'New York',
        jobTitle: 'Software Engineer',
        interests: ['Technology', 'Innovation'],
        challenges: ['Finding the right solution'],
        initialChallenge: 'I need a solution',
      };
      const savedPersona = { ...personaData, id: '456', company, companyId: '123' };
      
      configService.get.mockReturnValue('fake-api-key');
      companyService.storeCompanyInfo.mockResolvedValue(company);
      openAIService.generatePersona.mockResolvedValue(personaData);
      personaRepository.create.mockReturnValue({ ...personaData, company, companyId: '123' });
      personaRepository.save.mockResolvedValue(savedPersona);

      // Act
      const result = await service.generatePersona(companyDto);

      // Assert
      expect(configService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
      expect(companyService.storeCompanyInfo).toHaveBeenCalledWith(companyDto);
      expect(openAIService.generatePersona).toHaveBeenCalledWith(
        companyDto.name,
        companyDto.characteristics,
        undefined,
        undefined
      );
      expect(personaRepository.create).toHaveBeenCalled();
      expect(personaRepository.save).toHaveBeenCalled();
      expect(result).toEqual(savedPersona);
    });

    it('should generate a mock persona when OpenAI API key is not available', async () => {
      // Arrange
      const companyDto = {
        name: 'Test Company',
        characteristics: ['Innovative', 'Tech-focused'],
      };
      const company = { id: '123', name: 'Test Company' };
      const savedPersona = { 
        id: '456', 
        name: 'Mock Name',
        company, 
        companyId: '123' 
      };
      
      configService.get.mockReturnValue(null);
      companyService.storeCompanyInfo.mockResolvedValue(company);
      personaRepository.save.mockResolvedValue(savedPersona);

      // Act
      const result = await service.generatePersona(companyDto);

      // Assert
      expect(configService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
      expect(companyService.storeCompanyInfo).toHaveBeenCalledWith(companyDto);
      expect(openAIService.generatePersona).not.toHaveBeenCalled();
      expect(personaRepository.save).toHaveBeenCalled();
      expect(result).toEqual(savedPersona);
    });
  });

  describe('getPersonaById', () => {
    it('should return a persona by ID', async () => {
      // Arrange
      const id = '123';
      const persona = { id, name: 'Test Persona' };
      personaRepository.findOne.mockResolvedValue(persona);

      // Act
      const result = await service.getPersonaById(id);

      // Assert
      expect(personaRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['company'],
      });
      expect(result).toEqual(persona);
    });
  });

  describe('updatePersona', () => {
    it('should update a persona', async () => {
      // Arrange
      const persona = { 
        id: '123', 
        name: 'Updated Persona',
        age: 30,
        gender: 'Male',
        location: 'New York',
        jobTitle: 'Software Engineer',
        interests: ['Technology'],
        challenges: ['Finding solutions'],
        initialChallenge: 'I need help',
        companyId: '456',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      personaRepository.save.mockResolvedValue(persona);

      // Act
      const result = await service.updatePersona(persona as any);

      // Assert
      expect(personaRepository.save).toHaveBeenCalledWith(persona);
      expect(result).toEqual(persona);
    });
  });
});