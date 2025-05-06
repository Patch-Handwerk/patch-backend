import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/user.entity';
import { EmailModule } from 'src/email/email.module';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    // 2. Configure JwtModule asynchronously using env vars
    JwtModule.registerAsync({
      imports: [ConfigModule],                                    
      inject:  [ConfigService],                                   
      useFactory: async (config: ConfigService) => ({             
        secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),                 
        signOptions: { expiresIn: config.get<string>('JWT_ACCESS_TOKEN_EXPIRATION') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, JwtStrategy,JwtRefreshStrategy],
})
export class AuthModule {}
