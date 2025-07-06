import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { User } from '../user';
import { EmailModule } from '../email';
import { AuthService } from './services';

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
