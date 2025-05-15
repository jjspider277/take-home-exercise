import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CompanyDto } from '../company/dto/company.dto';
import { PersonaDto } from './dto/persona.dto';
import { Persona } from './entities/persona.entity';
import { CompanyService } from '../company/company.service';
import { OpenAIService } from '../../config/openai.config';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    private readonly configService: ConfigService,
    private readonly companyService: CompanyService,
    private readonly openAIService: OpenAIService,
  ) {}

  async generatePersona(companyDto: CompanyDto & { 
    knowledgeDomain?: string; 
    problemToSolve?: string;
  }): Promise<Persona> {
    // Store company information first
    const company = await this.companyService.storeCompanyInfo(companyDto);
    
    let personaData: PersonaDto;
    
    try {
      // Try to use OpenAI if configured
      const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
      
      if (openaiApiKey) {
        // Get persona from OpenAI with optional knowledge domain and problem
        personaData = await this.openAIService.generatePersona(
          companyDto.name,
          companyDto.characteristics,
          companyDto.knowledgeDomain,
          companyDto.problemToSolve
        );
      } else {
        // Fall back to mock data if no API key
        personaData = this.generateMockPersona(companyDto);
      }
    } catch (error) {
      console.error('Error generating AI persona:', error);
      // Fall back to mock data on error
      personaData = this.generateMockPersona(companyDto);
    }
    
    // Ensure required fields are present
    const validatedPersonaData = {
      ...personaData,
      // Provide defaults for required fields if they're missing
      name: personaData.name || 'Anonymous User',
      age: personaData.age || 30,
      gender: personaData.gender || 'Not specified',
      location: personaData.location || 'Remote',
      jobTitle: personaData.jobTitle || 'Professional',
      interests: Array.isArray(personaData.interests) ? personaData.interests : ['Technology', 'Innovation'],
      challenges: Array.isArray(personaData.challenges) ? personaData.challenges : ['Finding the right solution'],
      initialChallenge: personaData.initialChallenge || `I'm looking for a ${companyDto.name} solution that meets my needs.`
    };
    
    // Create and save the persona entity
    const persona = this.personaRepository.create({
      ...validatedPersonaData,
      company,
      companyId: company.id,
    });
    
    return this.personaRepository.save(persona);
  }
  
  async getPersonaById(id: string): Promise<Persona | null> {
    return this.personaRepository.findOne({ 
      where: { id },
      relations: ['company'],
    });
  }
  
  async updatePersona(persona: Persona): Promise<Persona> {
    return this.personaRepository.save(persona);
  }
  
  private generateMockPersona(companyDto: CompanyDto): PersonaDto {
    const { name, characteristics } = companyDto;
    
    // Generate a random persona
    const persona: PersonaDto = {
      name: this.generateName(),
      age: Math.floor(Math.random() * 40) + 25, // 25-65 years old
      gender: this.chooseRandom(['Male', 'Female', 'Non-binary']),
      location: this.chooseRandom(['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Chicago, IL']),
      jobTitle: this.generateJobTitle(characteristics),
      interests: this.generateInterests(characteristics),
      challenges: this.generateChallenges(characteristics),
      initialChallenge: `I've been looking for a ${name} solution that aligns with my needs. Can you help me understand how your products might work for someone like me?`,
      knowledgeDomain: this.generateKnowledgeDomain(characteristics),
      problemToSolve: this.generateProblemToSolve(name, characteristics),
    };
    
    return persona;
  }
  
  private generateKnowledgeDomain(characteristics: string[]): string {
    const domains = [
      'Sustainable product development and eco-friendly alternatives',
      'Digital marketing strategies and consumer engagement',
      'Enterprise software integration and workflow optimization',
      'Healthcare technology and patient care improvement',
      'Financial technology and secure payment processing',
      'E-commerce platforms and customer experience optimization',
      'Mobile application development and user experience design',
      'Cloud computing and data storage solutions',
      'Artificial intelligence and machine learning applications',
      'Cybersecurity and data protection protocols'
    ];
    
    // Try to match domain with company characteristics
    if (characteristics.some(c => c.toLowerCase().includes('eco') || c.toLowerCase().includes('sustain'))) {
      return domains[0];
    } else if (characteristics.some(c => c.toLowerCase().includes('market') || c.toLowerCase().includes('brand'))) {
      return domains[1];
    } else if (characteristics.some(c => c.toLowerCase().includes('tech') || c.toLowerCase().includes('software'))) {
      return this.chooseRandom([domains[2], domains[6], domains[7], domains[8]]);
    } else if (characteristics.some(c => c.toLowerCase().includes('health') || c.toLowerCase().includes('care'))) {
      return domains[3];
    } else if (characteristics.some(c => c.toLowerCase().includes('finance') || c.toLowerCase().includes('payment'))) {
      return domains[4];
    } else if (characteristics.some(c => c.toLowerCase().includes('commerce') || c.toLowerCase().includes('retail'))) {
      return domains[5];
    } else if (characteristics.some(c => c.toLowerCase().includes('security') || c.toLowerCase().includes('protect'))) {
      return domains[9];
    }
    
    // Default to random domain if no match
    return this.chooseRandom(domains);
  }
  
  private generateProblemToSolve(companyName: string, characteristics: string[]): string {
    const problems = [
      `Finding a ${companyName} solution that reduces environmental impact without compromising quality`,
      `Identifying ${companyName} products that integrate seamlessly with existing systems`,
      `Determining if ${companyName} can provide scalable solutions as my needs grow`,
      `Understanding how ${companyName}'s pricing model aligns with my budget constraints`,
      `Evaluating if ${companyName}'s customer support meets my organization's requirements`,
      `Assessing whether ${companyName}'s security features adequately protect sensitive data`,
      `Comparing ${companyName}'s offerings with competitors to ensure best value`,
      `Finding a ${companyName} solution that improves efficiency without extensive retraining`,
      `Determining if ${companyName}'s products are accessible and inclusive for all users`,
      `Understanding how ${companyName}'s roadmap aligns with future industry trends`
    ];
    
    // Try to match problem with company characteristics
    if (characteristics.some(c => c.toLowerCase().includes('eco') || c.toLowerCase().includes('sustain'))) {
      return problems[0];
    } else if (characteristics.some(c => c.toLowerCase().includes('tech') || c.toLowerCase().includes('software'))) {
      return this.chooseRandom([problems[1], problems[2], problems[7]]);
    } else if (characteristics.some(c => c.toLowerCase().includes('price') || c.toLowerCase().includes('cost'))) {
      return problems[3];
    } else if (characteristics.some(c => c.toLowerCase().includes('support') || c.toLowerCase().includes('service'))) {
      return problems[4];
    } else if (characteristics.some(c => c.toLowerCase().includes('security') || c.toLowerCase().includes('protect'))) {
      return problems[5];
    } else if (characteristics.some(c => c.toLowerCase().includes('value') || c.toLowerCase().includes('compare'))) {
      return problems[6];
    } else if (characteristics.some(c => c.toLowerCase().includes('access') || c.toLowerCase().includes('inclusive'))) {
      return problems[8];
    } else if (characteristics.some(c => c.toLowerCase().includes('future') || c.toLowerCase().includes('trend'))) {
      return problems[9];
    }
    
    // Default to random problem if no match
    return this.chooseRandom(problems);
  }
  
  private generateName(): string {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Cameron'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    return `${this.chooseRandom(firstNames)} ${this.chooseRandom(lastNames)}`;
  }
  
  private generateJobTitle(characteristics: string[]): string {
    const techJobs = ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist', 'IT Specialist'];
    const businessJobs = ['Marketing Manager', 'Business Analyst', 'Sales Director', 'Financial Advisor', 'HR Specialist'];
    const creativeJobs = ['Graphic Designer', 'Content Creator', 'Art Director', 'Photographer', 'Videographer'];
    
    if (characteristics.some(c => c.toLowerCase().includes('tech') || c.toLowerCase().includes('digital'))) {
      return this.chooseRandom(techJobs);
    } else if (characteristics.some(c => c.toLowerCase().includes('creative') || c.toLowerCase().includes('design'))) {
      return this.chooseRandom(creativeJobs);
    } else {
      return this.chooseRandom(businessJobs);
    }
  }
  
  private generateInterests(characteristics: string[]): string[] {
    const allInterests = [
      'Hiking', 'Photography', 'Reading', 'Cooking', 'Travel',
      'Technology', 'Fitness', 'Art', 'Music', 'Sustainability',
      'Gaming', 'Yoga', 'Gardening', 'Volunteering', 'Podcasts'
    ];
    
    // Select 3-5 random interests
    const count = Math.floor(Math.random() * 3) + 3;
    const interests: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let interest = this.chooseRandom(allInterests);
      while (interests.includes(interest)) {
        interest = this.chooseRandom(allInterests);
      }
      interests.push(interest);
    }
    
    return interests;
  }
  
  private generateChallenges(characteristics: string[]): string[] {
    const challenges = [
      'Finding products that align with personal values',
      'Balancing quality with affordability',
      'Navigating too many options in the market',
      'Finding reliable customer support',
      'Keeping up with industry trends',
      'Finding time-efficient solutions',
      'Identifying trustworthy brands',
      'Finding products that integrate with existing systems'
    ];
    
    // Select 2-3 challenges
    const count = Math.floor(Math.random() * 2) + 2;
    return this.shuffleArray(challenges).slice(0, count);
  }
  
  private chooseRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}