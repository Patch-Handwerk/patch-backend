import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

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
    UserModule,
    AuthModule,
    AdminModule
    
  ],
})
export class AppModule {}
