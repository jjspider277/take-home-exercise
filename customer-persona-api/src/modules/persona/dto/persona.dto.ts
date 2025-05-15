import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class PersonaDto {
  @ApiProperty({
    description: 'The ID of the persona',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'The name of the persona',
    example: 'Alex Johnson',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The age of the persona',
    example: 34,
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'The gender of the persona',
    example: 'Non-binary',
  })
  @IsString()
  gender: string;

  @ApiProperty({
    description: 'The location of the persona',
    example: 'Seattle, WA',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'The job title of the persona',
    example: 'UX Designer',
  })
  @IsString()
  jobTitle: string;

  @ApiProperty({
    description: 'The interests of the persona',
    example: ['Sustainable design', 'Hiking', 'Photography'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  interests: string[];

  @ApiProperty({
    description: 'The challenges faced by the persona',
    example: ['Finding eco-friendly products', 'Balancing work-life'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  challenges: string[];

  @ApiProperty({
    description: 'The initial challenge message from the persona',
    example: 'I\'ve been looking for a solution that aligns with my sustainability values.',
  })
  @IsString()
  initialChallenge: string;
  
  @ApiProperty({
    description: 'The knowledge domain of the persona',
    example: 'Sustainable technology and eco-friendly products',
    required: false,
  })
  @IsOptional()
  @IsString()
  knowledgeDomain?: string;
  
  @ApiProperty({
    description: 'The specific problem the persona is trying to solve',
    example: 'Finding a product that reduces carbon footprint while maintaining performance',
    required: false,
  })
  @IsOptional()
  @IsString()
  problemToSolve?: string;
  
  @ApiProperty({
    description: 'Temporary context for a specific conversation (not stored in database)',
    example: 'The persona has just learned about a new competitor product',
    required: false,
  })
  @IsOptional()
  @IsString()
  temporaryContext?: string;
}