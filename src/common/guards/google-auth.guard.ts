import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // This guard automatically:
  // 1. Redirects to Google OAuth page on first request
  // 2. Validates the callback from Google
  // 3. Runs GoogleStrategy.validate()
  // 4. Attaches user data to req.user
}

