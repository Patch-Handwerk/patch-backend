import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/user.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    // 2. Configure JwtModule asynchronously using env vars
    JwtModule.registerAsync({
      imports: [ConfigModule],                                    
      inject:  [ConfigService],                                   
      useFactory: async (config: ConfigService) => ({             
        secret: config.get<string>('JWT_SECRET'),                 
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, JwtStrategy],
})
export class AuthModule {}
