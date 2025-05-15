import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './modules/company/company.module';
import { PersonaModule } from './modules/persona/persona.module';
import { ChatModule } from './modules/chat/chat.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = new DatabaseConfig(configService);
        return dbConfig.getTypeOrmConfig();
      },
      inject: [ConfigService],
    }),
    CompanyModule,
    PersonaModule,
    ChatModule,
  ],
})
export class AppModule {}