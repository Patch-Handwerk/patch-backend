import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisTokenBlacklistService } from '../../modules/auth/services/redis-token-blacklist.service';

@Injectable()
export class JwtBlacklistGuard extends AuthGuard('jwt') {
  constructor(private readonly redisTokenBlacklistService: RedisTokenBlacklistService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Check if token is blacklisted in Redis
    const isBlacklisted = await this.redisTokenBlacklistService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // If not blacklisted, proceed with JWT validation
    return super.canActivate(context) as Promise<boolean>;
  }
}
