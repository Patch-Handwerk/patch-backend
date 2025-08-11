import { registerAs } from '@nestjs/config';

const RedisConfiguration = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'token_blacklist:',
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10), // 1 hour default
}));

export default RedisConfiguration;
export { RedisConfiguration };
