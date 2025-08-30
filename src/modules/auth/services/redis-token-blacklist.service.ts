import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import * as crypto from 'crypto';

@Injectable()
export class RedisTokenBlacklistService implements OnModuleDestroy {
  private readonly redisClient: RedisClientType;


  constructor(private readonly configService: ConfigService) {
    const redisConfig = this.configService.get('redis');
    

    if (!redisConfig) {
      console.warn('Redis configuration not found. Token blacklisting will be disabled.');
      return;
    }
    
    this.redisClient = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
      password: redisConfig.password,
      database: redisConfig.db,
    });

    // Connect to Redis
    this.redisClient.connect();

    // Handle Redis events
    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    this.redisClient.on('ready', () => {
      console.log('Redis Client Ready');
    });
  }

  /**
   * Create a hash of the token for secure storage
   * We NEVER store the actual token, only its hash
   */
  private createTokenHash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Add a token to the blacklist by storing its hash
   */
  async addToBlacklist(token: string): Promise<void> {
    try {
      const tokenHash = this.createTokenHash(token);
      const key = this.getBlacklistKey(tokenHash);
      const ttl = this.configService.get('redis.ttl');
      
      // Store only the hash, never the actual token
      await this.redisClient.setEx(key, ttl, 'revoked');
      console.log(`Token hash blacklisted with TTL: ${ttl}s`);
    } catch (error) {
      console.error('Error adding token to blacklist:', error);
      throw new Error('Failed to blacklist token');
    }
  }

  /**
   * Check if a token is blacklisted by checking its hash
   */
  async isBlacklisted(token: string): Promise<boolean> {
    try {
      const tokenHash = this.createTokenHash(token);
      const key = this.getBlacklistKey(tokenHash);
      const exists = await this.redisClient.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      // If Redis is down, assume token is not blacklisted to avoid blocking users
      return false;
    }
  }

  /**
   * Get the Redis key for a token hash
   */
  private getBlacklistKey(tokenHash: string): string {
    const prefix = this.configService.get('redis.keyPrefix') || 'token_blacklist:';
    return `${prefix}${tokenHash}`;
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}
