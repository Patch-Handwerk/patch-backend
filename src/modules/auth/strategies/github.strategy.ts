import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'passport-oauth2';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('github.clientID');
    const clientSecret = configService.get<string>('github.clientSecret');
    const callbackURL = configService.get<string>('github.callbackURL');
    const scope = configService.get<string[]>('github.scope');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing GitHub OAuth configuration values.');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: scope && scope.length > 0 ? scope : ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Extract user data from GitHub's response format
    const { id, username, displayName, emails, photos } = profile;
    
    // Normalize to our app's format
    const user = {
      provider: 'github',
      providerId: String(id),
      email: emails?.[0]?.value || emails?.[0],
      name: displayName || username || profile.name,
      avatar: photos?.[0]?.value || photos?.[0] || profile._json?.avatar_url,
    };
    
    // Pass normalized user to the next step (controller)
    done(null, user);
  }
}

