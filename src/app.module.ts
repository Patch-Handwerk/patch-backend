import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './db/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // your DB username
      password: 'hellosql123', // your DB password
      database: 'patch_db', // your DB name
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // only in dev
    }),
    UserModule
  ],
  controllers: [HealthController],
  providers: [AppService],
})
export class AppModule {}
