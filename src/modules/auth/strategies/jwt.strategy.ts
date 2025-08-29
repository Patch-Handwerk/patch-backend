import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    const secret = config.get<string>('accessTokenSecret');
    console.log('JWT Config Debug:', {
      accessTokenSecret: secret,
      envVar: process.env.JWT_ACCESS_TOKEN_SECRET
    });
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret || process.env.JWT_ACCESS_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Invalid token payload');
    }
    
    return { id: payload.id, role: payload.role };
  }
}
