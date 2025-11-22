import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers';
import { JwtRefreshStrategy, JwtStrategy, GoogleStrategy, LinkedInStrategy, GitHubStrategy } from './strategies';
import { User } from '../../database/entities';
import { EmailModule } from '../email';
import { AuthService } from './services';
import { RedisTokenBlacklistService } from './services/redis-token-blacklist.service';
import { JwtBlacklistGuard } from '../../common/guards/jwt-blacklist.guard';
import { OAuthConfiguration } from '../../config/configurations';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    ConfigModule.forFeature(OAuthConfiguration), // Load OAuth configuration
    // 2. Configure JwtModule asynchronously using env vars
    JwtModule.registerAsync({
      imports: [ConfigModule],                                    
      inject:  [ConfigService],                                   
      useFactory: async (config: ConfigService) => {
        const secret = config.get<string>('accessTokenSecret');
        const expiration = config.get<string>('accessTokenExpiration');
        
        return {
          secret: secret || process.env.JWT_ACCESS_TOKEN_SECRET,                 
          signOptions: { expiresIn: expiration || process.env.JWT_ACCESS_TOKEN_EXPIRATION },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers:   [
    AuthService, 
    JwtStrategy, 
    JwtRefreshStrategy, 
    GoogleStrategy,      // Register Google OAuth strategy
    LinkedInStrategy,   // Register LinkedIn OAuth strategy
    GitHubStrategy,     // Register GitHub OAuth strategy
    RedisTokenBlacklistService, 
    JwtBlacklistGuard
  ],
  exports: [RedisTokenBlacklistService, JwtStrategy],
})
export class AuthModule {}
