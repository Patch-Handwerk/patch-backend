import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
  .setTitle('Patch APIs')
  .setDescription('Api Documentation for the authentication and authorization system')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
 
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document); 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted:true,
    transform: true
  }));
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
