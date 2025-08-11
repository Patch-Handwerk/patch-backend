import { Controller, Post, Body, Get, Query, UseGuards,Req,Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { RequestWithUser } from 'src/config/types/RequestWithUser';
import { LoginDto,RegisterDto, ForgotPasswordDto,RefreshTokenDto,ResetPasswordDto } from '../dto';
import { AuthService } from '../services';
import { JwtAuthGuard, JwtRefreshGuard, JwtBlacklistGuard } from 'src/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
    // return res.redirect('https://your-frontend.com/verified-success'); will add in the end after success modal created
  }

  @ApiOperation({ summary: 'Refresh JWT tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
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
