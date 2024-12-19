import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST, // Usa as variáveis do .env
      port: parseInt(process.env.DATABASE_PORT, 10), 
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD || '', // Senha vazia
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: false, // Apenas para desenvolvimento
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
