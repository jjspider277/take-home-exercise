import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: ApiResponseDto,
  })
  async createCompany(@Body() companyDto: CompanyDto): Promise<ApiResponseDto<CompanyDto>> {
    const result = await this.companyService.storeCompanyInfo(companyDto);
    return ApiResponseDto.success(result, 'Company created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({
    status: 200,
    description: 'List of all companies',
    type: ApiResponseDto,
  })
  async getAllCompanies(): Promise<ApiResponseDto<CompanyDto[]>> {
    const companies = await this.companyService.getAllCompanies();
    return ApiResponseDto.success(companies, 'Companies retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Company retrieved successfully',
    type: ApiResponseDto,
  })
  async getCompanyById(@Param('id') id: string): Promise<ApiResponseDto<CompanyDto>> {
    const company = await this.companyService.getCompanyById(id);
    return ApiResponseDto.success(company, 'Company retrieved successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: ApiResponseDto,
  })
  async updateCompany(
    @Param('id') id: string,
    @Body() companyDto: CompanyDto,
  ): Promise<ApiResponseDto<CompanyDto>> {
    const company = await this.companyService.updateCompany(id, companyDto);
    return ApiResponseDto.success(company, 'Company updated successfully');
  }
}