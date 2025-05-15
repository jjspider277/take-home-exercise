import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsOptional, IsBoolean } from 'class-validator';

export class CompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'EcoTech Solutions',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the company',
    example: 'A leading provider of eco-friendly technology solutions',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Characteristics or tags describing the company',
    example: ['Sustainable', 'Tech-focused', 'Innovative'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  characteristics: string[];
  
  @ApiProperty({
    description: 'Whether the company is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  
  @ApiProperty({
    description: 'The knowledge domain for the persona',
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
}