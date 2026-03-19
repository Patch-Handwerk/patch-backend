import {
  Controller,
  Post,
  Patch,
  Body,
  Get,
  Query,
  UseGuards,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'src/config/types/RequestWithUser';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from '../dto';
import { AuthService } from '../services';
import {
  JwtRefreshGuard,
  JwtBlacklistGuard,
  GoogleAuthGuard,
  LinkedInAuthGuard,
  GitHubAuthGuard,
} from 'src/common';
import {
  LoginResponseDto,
  RegisterResponseDto,
  GetAllUsersResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  VerifyEmailResponseDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
  UpdateOnboardingStatusResponseDto,
  CurrentUserResponseDto,
} from '../dto/auth-response.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // List all users in database
  @ApiOperation({
    summary: 'List all users in database',
    description: 'Debug endpoint to list all users currently in the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully',
    type: GetAllUsersResponseDto,
  })
  @Get('users/list')
  async getAllUsers() {
    try {
      const users = await this.authService.getAllUsers();
      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve users: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Register a new user
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with the provided information. The user will receive a verification email to activate their account.',
  })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully. A verification email has been sent.',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or user already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during registration',
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Login a user
  @ApiOperation({
    summary: 'Login a user',
    description:
      'Authenticates a user with email and password. Returns JWT access and refresh tokens for subsequent API calls.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access and refresh tokens.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed',
    type: ErrorResponseDto,
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Request password reset email
  @ApiOperation({
    summary: 'Request password reset email',
    description:
      'Sends a password reset email to the user with a secure token. The user can use this token to reset their password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully.',
    type: ForgotPasswordResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found with the provided email.',
  })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // Reset password using token
  @ApiOperation({
    summary: 'Reset password using token',
    description:
      'Resets the user password using the token received via email. The token must be valid and not expired.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully.',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // Verify user email
  @ApiOperation({
    summary: 'Verify user email',
    description:
      'Verifies the user email address using the token sent during registration. This endpoint is typically accessed via a link in the verification email.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully.',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @ApiQuery({
    name: 'token',
    description: 'Email verification token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
    // return res.redirect('https://your-frontend.com/verified-success'); will add in the end after success modal created
  }

  // Refresh JWT tokens
  @ApiOperation({
    summary: 'Refresh JWT tokens',
    description:
      'Refreshes the access token using a valid refresh token. This endpoint is used when the access token expires to get a new one without requiring the user to login again.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully.',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  // Logout user
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logs out the user by invalidating their access token and clearing refresh tokens. This endpoint requires a valid JWT token in the Authorization header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully.',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @UseGuards(JwtBlacklistGuard)
  @Post('logout')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Extract the access token from the Authorization header
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    // 1) Clear the refresh_token cookie on the client
    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    // 2) Blacklist the access token and remove refreshToken from the database
    await this.authService.logout(req.user.id, accessToken);

    return { message: 'Logged out successfully' };
  }

  // Get current authenticated user
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns the profile of the currently authenticated user. Requires a valid JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully.',
    type: CurrentUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @UseGuards(JwtBlacklistGuard)
  @Get('me')
  async getCurrentUser(@Req() req: RequestWithUser) {
    return this.authService.getCurrentUser(req.user.id);
  }

  // Update onboarding status
  @ApiOperation({
    summary: 'Mark onboarding as completed',
    description:
      "Updates the authenticated user's onboarding status to completed. Requires a valid JWT token.",
  })
  @ApiResponse({
    status: 200,
    description: 'Onboarding status updated successfully.',
    type: UpdateOnboardingStatusResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(JwtBlacklistGuard)
  @Patch('users/onboarding')
  async updateOnboardingStatus(@Req() req: RequestWithUser) {
    return this.authService.updateOnboardingStatus(req.user.id);
  }

  // ==================== OAuth Endpoints ====================

  // Google OAuth - Initiate
  @ApiOperation({
    summary: 'Initiate Google OAuth login',
    description:
      'Redirects user to Google login page. Pass the selected role (consultant/craftsman) as a query parameter.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'User role: consultant or craftsman',
    example: 'consultant',
  })
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Query('role') role: string) {
    // Guard automatically redirects to Google OAuth
    // The role will be passed through OAuth state
  }

  // Google OAuth - Callback
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Handles the callback from Google after user authenticates. Creates or updates user and redirects to frontend with tokens.',
  })
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: any,
    @Res() res: Response,
    @Query('state') state: string,
  ) {
    try {
      // req.user contains normalized OAuth data from GoogleStrategy
      const result = await this.authService.oauthLogin(req.user, state);

      // Redirect to frontend with tokens
      const frontendUrl = this.configService.get<string>('frontendRedirectUrl');
      const redirectUrl = `${frontendUrl}/auth/callback?token=${result.accessToken}&refreshToken=${result.refresh_token}&role=${result.publicUser.role}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      // On error, redirect to frontend error page
      const frontendUrl = this.configService.get<string>('frontendRedirectUrl');
      return res.redirect(`${frontendUrl}/auth/error?message=${error.message}`);
    }
  }

  // LinkedIn OAuth - Initiate
  @ApiOperation({
    summary: 'Initiate LinkedIn OAuth login',
    description:
      'Redirects user to LinkedIn login page. Pass the selected role (consultant/craftsman) as a query parameter.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'User role: consultant or craftsman',
    example: 'consultant',
  })
  @Get('linkedin')
  @UseGuards(LinkedInAuthGuard)
  async linkedinAuth(@Query('role') role: string) {
    // Guard automatically redirects to LinkedIn OAuth
    // The role will be passed through OAuth state
  }

  // LinkedIn OAuth - Callback
  @ApiOperation({
    summary: 'LinkedIn OAuth callback',
    description:
      'Handles the callback from LinkedIn after user authenticates. Creates or updates user and redirects to frontend with tokens.',
  })
  @Get('linkedin/callback')
  @UseGuards(LinkedInAuthGuard)
  async linkedinAuthCallback(
    @Req() req: any,
    @Res() res: Response,
    @Query('state') state: string,
  ) {
    try {
      // req.user contains normalized OAuth data from LinkedInStrategy
      const result = await this.authService.oauthLogin(req.user, state);

      // Redirect to frontend with tokens
      const frontendUrl = this.configService.get<string>('frontendRedirectUrl');
      const redirectUrl = `${frontendUrl}/auth/callback?token=${result.accessToken}&refreshToken=${result.refresh_token}&role=${result.publicUser.role}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      // On error, redirect to frontend error page
      const frontendUrl = this.configService.get<string>('frontendRedirectUrl');
      return res.redirect(`${frontendUrl}/auth/error?message=${error.message}`);
    }
  }

  // OAuth Callback Handler (for testing/development)
  // This endpoint receives tokens from OAuth redirects
  @ApiOperation({
    summary: 'OAuth callback handler',
    description:
      'Receives OAuth tokens after successful authentication. For testing purposes - in production, handle this in your frontend.',
  })
  @ApiQuery({ name: 'token', required: false, description: 'JWT access token' })
  @ApiQuery({
    name: 'refreshToken',
    required: false,
    description: 'JWT refresh token',
  })
  @ApiQuery({ name: 'role', required: false, description: 'User role' })
  @Get('callback')
  async oauthCallback(
    @Query('token') token: string,
    @Query('refreshToken') refreshToken: string,
    @Query('role') role: string,
  ) {
    if (!token) {
      return {
        success: false,
        message: 'No token provided',
      };
    }

    return {
      success: true,
      message: 'OAuth authentication successful!',
      data: {
        accessToken: token,
        refreshToken: refreshToken,
        role: role,
      },
      note: 'In production, handle this callback in your frontend application. Store tokens securely and redirect user to dashboard.',
    };
  }

  // GitHub OAuth - Initiate
  @ApiOperation({
    summary: 'Initiate GitHub OAuth login',
    description:
      'Redirects user to GitHub login page. Pass the selected role (consultant/craftsman) as a query parameter.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'User role: consultant or craftsman',
    example: 'consultant',
  })
  @Get('github')
  @UseGuards(GitHubAuthGuard)
  async githubAuth(@Query('role') role: string) {
    // Guard automatically redirects to GitHub OAuth
    // The role will be passed through OAuth state
  }

  // GitHub OAuth - Callback
  @ApiOperation({
    summary: 'GitHub OAuth callback',
    description:
      'Handles the callback from GitHub after user authenticates. Creates or updates user and redirects to frontend with tokens.',
  })
  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubAuthCallback(
    @Req() req: any,
    @Res() res: Response,
    @Query('state') state: string,
  ) {
    try {
      // req.user contains normalized OAuth data from GitHubStrategy
      const result = await this.authService.oauthLogin(req.user, state);

      // Redirect to frontend with tokens
      const frontendUrl = this.configService.get<string>('frontendRedirectUrl');
      const redirectUrl = `${frontendUrl}/auth/callback?token=${result.accessToken}&refreshToken=${result.refresh_token}&role=${result.publicUser.role}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      // On error, redirect to frontend error page
      const frontendUrl = this.configService.get<string>('frontendRedirectUrl');
      return res.redirect(`${frontendUrl}/auth/error?message=${error.message}`);
    }
  }
}
