import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyDto } from './dto/company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async storeCompanyInfo(companyDto: CompanyDto): Promise<Company> {
    // Set isActive to true by default if not provided
    const companyData = {
      ...companyDto,
      isActive: companyDto.isActive !== undefined ? companyDto.isActive : true
    };
    
    const company = this.companyRepository.create(companyData);
    return this.companyRepository.save(company);
  }

  async getAllCompanies(): Promise<Company[]> {
    return this.companyRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async getActiveCompanies(): Promise<Company[]> {
    return this.companyRepository.find({
      where: { isActive: true },
      order: {
        name: 'ASC'
      }
    });
  }

  async getCompanyByName(name: string): Promise<Company | null> {
    return this.companyRepository.findOne({ where: { name } });
  }
  
  async getCompanyById(id: string): Promise<Company | null> {
    const company = await this.companyRepository.findOne({ where: { id } });
    
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    
    return company;
  }
  
  async updateCompany(id: string, companyDto: CompanyDto): Promise<Company> {
    const company = await this.getCompanyById(id);
    
    // Update company properties
    Object.assign(company, companyDto);
    
    return this.companyRepository.save(company);
  }
}