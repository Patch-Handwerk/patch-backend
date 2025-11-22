import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LinkedInAuthGuard extends AuthGuard('linkedin') {
  // This guard automatically:
  // 1. Redirects to LinkedIn OAuth page on first request
  // 2. Validates the callback from LinkedIn
  // 3. Runs LinkedInStrategy.validate()
  // 4. Attaches user data to req.user

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error about profile fetching, log it but let strategy handle it
    if (err && err.message && err.message.includes('failed to fetch user profile')) {
      console.log('[LinkedIn Auth Guard] Profile fetch failed - strategy will handle manual fetch');
    }

    if (err) {
      console.error('[LinkedIn Auth Guard] Authentication error:', err);
      console.error('[LinkedIn Auth Guard] Error message:', err.message);
      console.error('[LinkedIn Auth Guard] Error name:', err.name);
      console.error('[LinkedIn Auth Guard] Error stack:', err.stack);
      
      // If it's a profile fetch error, we'll let it through to see if we can handle it in strategy
      if (err.message && err.message.includes('failed to fetch user profile')) {
        // Try to continue - the strategy's validate might handle it
        console.log('[LinkedIn Auth Guard] Profile fetch error detected, allowing to continue to strategy');
      } else {
        throw err;
      }
    }
    
    if (info) {
      console.error('[LinkedIn Auth Guard] Info:', info);
    }
    
    return super.handleRequest(err, user, info, context);
  }
}

