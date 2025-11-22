import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GitHubAuthGuard extends AuthGuard('github') {
  // This guard automatically:
  // 1. Redirects to GitHub OAuth page on first request
  // 2. Validates the callback from GitHub
  // 3. Runs GitHubStrategy.validate()
  // 4. Attaches user data to req.user
}

