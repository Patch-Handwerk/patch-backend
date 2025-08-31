import { Controller, Post, Body, Get, Query, UseGuards,Req,Res, HttpException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { RequestWithUser } from 'src/config/types/RequestWithUser';
import { LoginDto,RegisterDto, ForgotPasswordDto,RefreshTokenDto,ResetPasswordDto } from '../dto';
import { AuthService } from '../services';
import { JwtAuthGuard, JwtRefreshGuard, JwtBlacklistGuard } from 'src/common';
import { LoginResponseDto, RegisterResponseDto } from '../dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided information. The user will receive a verification email to activate their account.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully. A verification email has been sent.',
    type: RegisterResponseDto
  })
  @ApiResponse({ status: 400, description: 'Validation error or user already exists' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const result = await this.authService.register(dto);
      return result;
    } catch (error) {
      // Handle the special case where HttpException is used for success
      if (error instanceof HttpException && error.getStatus() === 201) {
        return {
          success: true,
          message: error.message,
          data: {
            user: {
              id: null,
              name: dto.name,
              email: dto.email,
              role: dto.role,
              user_status: 'PENDING',
              is_verified: false,
              createdAt: new Date().toISOString()
            },
            emailSent: true
          }
        };
      }
      // Let the global exception filter handle other errors
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'Login a user',
    description: 'Authenticates a user with email and password. Returns JWT access and refresh tokens for subsequent API calls.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful. Returns access and refresh tokens.',
    type: LoginResponseDto
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ 
    summary: 'Request password reset email',
    description: 'Sends a password reset email to the user with a secure token. The user can use this token to reset their password.'
  })
  @ApiResponse({ status: 200, description: 'Password reset email sent successfully.' })
  @ApiResponse({ status: 404, description: 'User not found with the provided email.' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiOperation({ 
    summary: 'Reset password using token',
    description: 'Resets the user password using the token received via email. The token must be valid and not expired.'
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({ 
    summary: 'Verify user email',
    description: 'Verifies the user email address using the token sent during registration. This endpoint is typically accessed via a link in the verification email.'
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @ApiQuery({ name: 'token', description: 'Email verification token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
    // return res.redirect('https://your-frontend.com/verified-success'); will add in the end after success modal created
  }

  @ApiOperation({ 
    summary: 'Refresh JWT tokens',
    description: 'Refreshes the access token using a valid refresh token. This endpoint is used when the access token expires to get a new one without requiring the user to login again.'
  })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiOperation({ 
    summary: 'Logout user',
    description: 'Logs out the user by invalidating their access token and clearing refresh tokens. This endpoint requires a valid JWT token in the Authorization header.'
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @UseGuards(JwtBlacklistGuard)
  @Post('logout')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {

    console.log(req.user, 'req.user');
    console.log(req, 'req');
    // Extract the access token from the Authorization header
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    
    // 1) Clear the refresh_token cookie on the client
    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    // 2) Blacklist the access token and remove refreshToken from the database
    await this.authService.logout(req.user.id, accessToken);

    return { message: 'Logged out successfully' };
  }
}
