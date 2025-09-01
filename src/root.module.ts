import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule, AuthModule, EmailModule } from './modules';
import {
  AppConfifuration,
  EmailConfiguration,
  AdminConfiguration,
  JwtConfiguration,
  RedisConfiguration,
} from './config';
import { EvaluationModule } from './modules/evaluation/evaluation.module';

@Module({
  imports: [
    // 1. Load .env and make ConfigService global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AppConfifuration,
        AdminConfiguration,
        JwtConfiguration,
        EmailConfiguration,
        RedisConfiguration,
      ],
    }),
    // 2. Configure TypeORM based on environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<boolean>('TYPEORM_SYNC'),
        ssl: process.env.NODE_ENV === 'production' ? {
          rejectUnauthorized: false
        } : false,
      }),
    }),
    AuthModule,
    AdminModule,
    EmailModule,
    EvaluationModule,
  ],
})
export class RootModule {}
