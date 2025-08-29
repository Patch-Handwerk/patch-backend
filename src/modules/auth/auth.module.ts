import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { User } from '../../database/entities';
import { EmailModule } from '../email';
import { AuthService } from './services';
import { RedisTokenBlacklistService } from './services/redis-token-blacklist.service';
import { JwtBlacklistGuard } from '../../common/guards/jwt-blacklist.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    // 2. Configure JwtModule asynchronously using env vars
    JwtModule.registerAsync({
      imports: [ConfigModule],                                    
      inject:  [ConfigService],                                   
      useFactory: async (config: ConfigService) => ({             
        secret: config.get<string>('accessTokenSecret'),                 
        signOptions: { expiresIn: config.get<string>('accessTokenExpiration') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, JwtStrategy, JwtRefreshStrategy, RedisTokenBlacklistService, JwtBlacklistGuard],
  exports: [RedisTokenBlacklistService],
})
export class AuthModule {}
