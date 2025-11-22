import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './core/exceptions';
import { ResponseInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  // Enhanced CORS configuration for production
  app.enableCors({
    origin: true, // Allow all origins in development/production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Handle favicon requests to prevent 404 errors
  app.use('/favicon.ico', (req: any, res: any) => {
    res.status(204).end(); // No content response
  });

  // Simple health check endpoint
  app.use('/health', (req: any, res: any) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor for standardized responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Patch Backend API')
    .setDescription(`
# 🚀 Patch Backend API Documentation

Welcome to the Patch Backend API! This documentation provides comprehensive information about all available endpoints, request/response formats, and authentication methods.

## 📋 Quick Start

1. **Authentication**: Most endpoints require Bearer token authentication
2. **Base URL**: All endpoints are relative to this base URL
3. **Response Format**: All responses follow a standardized format
4. **Error Handling**: Detailed error messages for debugging

## 🔐 Authentication

This API uses JWT (JSON Web Token) authentication. Include your token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Getting Started with Authentication:

1. **Register**: Create a new account using the register endpoint
2. **Login**: Get your access and refresh tokens
3. **Use Tokens**: Include the access token in your API requests
4. **Refresh**: Use the refresh token to get new access tokens when they expire

## 📊 Response Format

All API responses follow this standardized structure:
\`\`\`json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2025-08-30T01:39:34.123Z"
}
\`\`\`

### Error Response Format:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": "Error type",
  "timestamp": "2025-08-30T01:39:34.123Z"
}
\`\`\`

## 🛠️ Available Modules

### 🔐 Authentication & Authorization
- **User Registration**: Create new user accounts
- **User Login**: Authenticate and get JWT tokens
- **Password Management**: Reset and change passwords
- **Email Verification**: Verify user email addresses
- **Token Management**: Refresh and logout tokens

### 👨‍💼 Administrative Functions
- **User Management**: View and manage all users
- **User Status Updates**: Activate/deactivate users
- **Role Management**: Assign and manage user roles

### 📊 Assessment System
- **Phase Management**: Get evaluation phases
- **Question Management**: Retrieve questions and answers
- **Progress Tracking**: Calculate and store user progress
- **Assessment Data**: Complete assessment information

### 📧 Email Services
- **Email Notifications**: Send verification and reset emails
- **Email Templates**: Pre-configured email templates

## 🚀 API Endpoints Overview

### Authentication Endpoints
- \`POST /auth/register\` - Register a new user
- \`POST /auth/login\` - Login and get tokens
- \`POST /auth/forgot-password\` - Request password reset
- \`POST /auth/reset-password\` - Reset password with token
- \`GET /auth/verify-email\` - Verify email address
- \`POST /auth/refresh\` - Refresh access token
- \`POST /auth/logout\` - Logout and invalidate tokens

### Evaluation Endpoints
- \`GET /evaluation/phases\` - Get all evaluation phases
- \`GET /evaluation/phases/{phaseId}/subphases\` - Get subphases for a phase
- \`GET /evaluation/subphases/{subphaseId}/question\` - Get questions for a subphase
- \`GET /evaluation/phases/{phaseId}/complete\` - Get complete phase data
- \`GET /evaluation/complete-assessment\` - Get all assessment data
- \`POST /evaluation/answers\` - Submit answers and calculate progress
- \`GET /evaluation/{userId}/progress\` - Get user progress

### Admin Endpoints
- \`GET /admin/users\` - Get all users (Admin only)
- \`PATCH /admin/users/{userId}/status\` - Update user status (Admin only)

## 📞 Support

For technical support or questions, please contact the Patch team.

## 🔧 Development

- **Environment**: Production-ready with proper error handling
- **Security**: JWT authentication with token blacklisting
- **Validation**: Comprehensive input validation
- **Documentation**: Auto-generated with examples
    `)
    .setVersion('1.0.0')
    .addTag('auth', 'Authentication & Authorization')
    .addTag('admin', 'Administrative Functions')
    .addTag('evaluation', 'Assessment System')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('https://patch-backend-i898.onrender.com', 'Production Server')
    .addServer('http://localhost:3001', 'Local Development Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);


  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/', (req, res) => res.redirect('/api'));
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? 'localhost';

  try {
    await app.listen(port, host);
    console.log(`[app] Server listening at http://${host}:${port}`);
    console.log(`[app] Swagger UI available at http://${host}:${port}/api`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(`[app] Port ${port} is already in use.`);
      console.error(`[app] Options:`);
      console.error(`[app]  1. Terminate the process that is using port ${port}.`);
      console.error(`[app]     Windows: netstat -ano | findstr :${port} && taskkill /PID <PID> /F`);
      console.error(`[app]     macOS/Linux: lsof -ti:${port} | xargs kill -9`);
      console.error(`[app]  2. Set the PORT environment variable to a different value.`);
      console.error(`[app]  3. Wait a few seconds and retry.`);
      process.exit(1);
    } else {
      console.error('[app] Failed to start application.', error);
      process.exit(1);
    }
  }
}
bootstrap();
