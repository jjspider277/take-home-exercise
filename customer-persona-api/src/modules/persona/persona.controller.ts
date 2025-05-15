import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PersonaService } from './persona.service';
import { CompanyDto } from '../company/dto/company.dto';
import { PersonaDto } from './dto/persona.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('persona')
@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a customer persona based on company information' })
  @ApiResponse({
    status: 201,
    description: 'Persona generated successfully',
    type: ApiResponseDto,
  })
  async generatePersona(@Body() companyDto: CompanyDto): Promise<ApiResponseDto<PersonaDto>> {
    const persona = await this.personaService.generatePersona(companyDto);
    return ApiResponseDto.success(persona, 'Persona generated successfully');
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get a persona by ID' })
  @ApiParam({ name: 'id', description: 'Persona ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona retrieved successfully',
    type: ApiResponseDto,
  })
  async getPersonaById(@Param('id') id: string): Promise<ApiResponseDto<PersonaDto>> {
    const persona = await this.personaService.getPersonaById(id);
    return ApiResponseDto.success(persona, 'Persona retrieved successfully');
  }
  
  @Post('generate-with-knowledge')
  @ApiOperation({ summary: 'Generate a customer persona with specific knowledge domain and problem to solve' })
  @ApiResponse({
    status: 201,
    description: 'Persona with knowledge domain generated successfully',
    type: ApiResponseDto,
  })
  async generatePersonaWithKnowledge(@Body() companyDto: CompanyDto & { 
    knowledgeDomain?: string; 
    problemToSolve?: string;
  }): Promise<ApiResponseDto<PersonaDto>> {
    // Extract knowledge domain and problem if provided
    const { knowledgeDomain, problemToSolve, ...companyData } = companyDto;
    
    // Generate the persona
    const persona = await this.personaService.generatePersona({
      ...companyData,
      // Add these fields to characteristics if provided
      characteristics: [
        ...companyData.characteristics,
        ...(knowledgeDomain ? [`Knowledge in: ${knowledgeDomain}`] : []),
        ...(problemToSolve ? [`Problem: ${problemToSolve}`] : []),
      ]
    });
    
    // Explicitly set the knowledge domain and problem if provided
    if (knowledgeDomain) {
      persona.knowledgeDomain = knowledgeDomain;
    }
    
    if (problemToSolve) {
      persona.problemToSolve = problemToSolve;
    }
    
    // Save the updated persona
    const updatedPersona = await this.personaService.updatePersona(persona);
    
    return ApiResponseDto.success(updatedPersona, 'Persona with knowledge domain generated successfully');
  }
}