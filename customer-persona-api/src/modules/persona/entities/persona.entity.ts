import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  age: number;

  @Column({ length: 50 })
  gender: string;

  @Column({ length: 100 })
  location: string;

  @Column({ length: 100 })
  jobTitle: string;

  @Column('simple-array')
  interests: string[];

  @Column('simple-array')
  challenges: string[];

  @Column({ type: 'text' })
  initialChallenge: string;
  
  @Column({ type: 'text', nullable: true })
  knowledgeDomain: string;
  
  @Column({ type: 'text', nullable: true })
  problemToSolve: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}