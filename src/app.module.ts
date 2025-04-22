import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';           
import { TypeOrmModule } from '@nestjs/typeorm';                    
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // 1. Load .env and make ConfigService global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Configure TypeORM based on environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (config: ConfigService) => ({
        type:       'postgres',
        host:       config.get<string>('DB_HOST'),
        port:       config.get<number>('DB_PORT'),
        username:   config.get<string>('DB_USERNAME'),
        password:   config.get<string>('DB_PASSWORD'),
        database:   config.get<string>('DB_NAME'),
        entities:   [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<boolean>('TYPEORM_SYNC'),
      }),
    }),
    UserModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}
