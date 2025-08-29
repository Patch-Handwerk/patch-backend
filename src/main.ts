import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import {ValidationPipe} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './core/exceptions';
import { ResponseInterceptor } from './common/interceptors';
import { Express } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.enableCors();
  
  // Handle favicon requests to prevent 404 errors
  app.use('/favicon.ico', (req: any, res: any) => {
    res.status(204).end(); // No content response
  });
  
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Global response interceptor for standardized responses
  app.useGlobalInterceptors(new ResponseInterceptor());
  
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
  const port = process.env.PORT ?? 3002;
  const host = process.env.HOST ?? '0.0.0.0';
  
  try {
    await app.listen(port, host);
    console.log(`🚀 Application is running on: http://${host}:${port}`);
    console.log(`📚 Swagger documentation available at: http://${host}:${port}/api`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Please try one of the following:`);
      console.error(`   1. Kill the process using port ${port}:`);
      console.error(`      Windows: netstat -ano | findstr :${port} && taskkill /PID <PID> /F`);
      console.error(`      Linux/Mac: lsof -ti:${port} | xargs kill -9`);
      console.error(`   2. Use a different port by setting PORT environment variable`);
      console.error(`   3. Wait a few seconds and try again`);
      process.exit(1);
    } else {
      console.error('❌ Failed to start application:', error);
      process.exit(1);
    }
  }
}
bootstrap();
