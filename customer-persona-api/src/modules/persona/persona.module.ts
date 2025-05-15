import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaController } from './persona.controller';
import { PersonaService } from './persona.service';
import { Persona } from './entities/persona.entity';
import { CompanyModule } from '../company/company.module';
import { OpenAIService } from '../../config/openai.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona]),
    CompanyModule
  ],
  controllers: [PersonaController],
  providers: [PersonaService, OpenAIService],
  exports: [PersonaService],
})
export class PersonaModule {}