import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { VerifyCallback } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// Override the userProfile method to use userinfo endpoint for OpenID Connect
const originalUserProfile = (Strategy.prototype as any).userProfile;
(Strategy.prototype as any).userProfile = function(accessToken: string, done: any) {
  // Check if we're using OpenID Connect scopes
  const scopes = (this as any)._scope || [];
  if (scopes.includes('openid')) {
    // Use userinfo endpoint for OpenID Connect
    console.log('[LinkedIn Strategy] Overriding userProfile to use /v2/userinfo endpoint');
    axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      console.log('[LinkedIn Strategy] Successfully fetched from userinfo endpoint');
      done(null, response.data);
    })
    .catch((error) => {
      console.error('[LinkedIn Strategy] userinfo endpoint failed:', error.response?.data || error.message);
      // Fallback to original method (will likely fail but we'll handle in validate)
      if (originalUserProfile) {
        originalUserProfile.call(this, accessToken, done);
      } else {
        done(error);
      }
    });
  } else {
    // Use original method for non-OpenID Connect
    if (originalUserProfile) {
      originalUserProfile.call(this, accessToken, done);
    } else {
      done(new Error('userProfile method not available'));
    }
  }
};

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('linkedin.clientID');
    const clientSecret = configService.get<string>('linkedin.clientSecret');
    const callbackURL = configService.get<string>('linkedin.callbackURL');
    const scope = configService.get<string[]>('linkedin.scope');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing LinkedIn OAuth configuration values.');
    }

    const finalScope = scope && scope.length > 0 ? scope : ['openid', 'profile', 'email'];
    
    // Log configuration for debugging (remove in production)
    console.log('[LinkedIn Strategy] Configuration:');
    console.log('  - Client ID:', clientID ? `${clientID.substring(0, 8)}...` : 'MISSING');
    console.log('  - Client Secret:', clientSecret ? `***SET (length: ${clientSecret.length})***` : 'MISSING');
    console.log('  - Client Secret starts with:', clientSecret ? clientSecret.substring(0, 8) : 'N/A');
    console.log('  - Client Secret ends with:', clientSecret ? clientSecret.slice(-3) : 'N/A');
    console.log('  - Callback URL:', callbackURL);
    console.log('  - Callback URL length:', callbackURL?.length);
    console.log('  - Scopes:', finalScope);
    
    // Verify secret format
    if (clientSecret && !clientSecret.endsWith('==') && !clientSecret.endsWith('=')) {
      console.warn('[LinkedIn Strategy] WARNING: Client Secret does not end with == or =, might be incorrect format');
    }

    // For OpenID Connect, LinkedIn uses /v2/userinfo endpoint
    // The package might be trying to use /v2/me which doesn't work with OpenID Connect
    const strategyOptions: any = {
      clientID,
      clientSecret,
      callbackURL,
      scope: finalScope,
    };

    // Try to set profile URL for OpenID Connect
    // LinkedIn OpenID Connect uses: https://api.linkedin.com/v2/userinfo
    // Old API uses: https://api.linkedin.com/v2/me
    if (finalScope.includes('openid')) {
      // Try setting custom profile URL (if package supports it)
      // Some passport strategies support profileURL option
      strategyOptions.profileURL = 'https://api.linkedin.com/v2/userinfo';
      console.log('[LinkedIn Strategy] Using OpenID Connect - setting profileURL to userinfo endpoint');
    }

    super(strategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      console.log('[LinkedIn Strategy] Validate called with:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        profileType: typeof profile,
        profileKeys: profile ? Object.keys(profile) : 'null',
      });

      // If profile is null/undefined, manually fetch from LinkedIn userinfo endpoint
      let userProfile = profile;
      
      if (!userProfile && accessToken) {
        console.log('[LinkedIn Strategy] Profile not provided, fetching from userinfo endpoint...');
        try {
          // LinkedIn OpenID Connect userinfo endpoint
          const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          userProfile = response.data;
          console.log('[LinkedIn Strategy] Successfully fetched profile from userinfo endpoint');
        } catch (fetchError) {
          console.error('[LinkedIn Strategy] Failed to fetch from userinfo endpoint:', fetchError.response?.data || fetchError.message);
          // Try alternative endpoint
          try {
            const altResponse = await axios.get('https://api.linkedin.com/v2/me', {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });
            userProfile = altResponse.data;
            console.log('[LinkedIn Strategy] Successfully fetched profile from /v2/me endpoint');
          } catch (altError) {
            console.error('[LinkedIn Strategy] Failed to fetch from /v2/me endpoint:', altError.response?.data || altError.message);
            throw new Error('Failed to fetch user profile from LinkedIn API');
          }
        }
      }

      // For OpenID Connect, profile structure might be different
      // Handle both old API format and OpenID Connect format
      let id, name, emails, photos;

      if (userProfile) {
        // OpenID Connect format (from userinfo endpoint)
        id = userProfile.sub || userProfile.id;
        name = userProfile.name || (userProfile.given_name && userProfile.family_name 
          ? { givenName: userProfile.given_name, familyName: userProfile.family_name }
          : null);
        emails = userProfile.email ? [{ value: userProfile.email }] : userProfile.emails;
        photos = userProfile.picture ? [{ value: userProfile.picture }] : userProfile.photos;
        
        // Fallback to old API format
        if (!id) id = userProfile.id;
        if (!name) name = userProfile.name;
        if (!emails) emails = userProfile.emails;
        if (!photos) photos = userProfile.photos;
      }
      
      console.log('[LinkedIn Strategy] Extracted profile data:', {
        id: id ? `${String(id).substring(0, 10)}...` : 'MISSING',
        hasName: !!name,
        nameType: name ? typeof name : 'null',
        hasEmail: !!emails,
        hasPhotos: !!photos,
        rawProfile: JSON.stringify(userProfile).substring(0, 200),
      });
      
      // Normalize to our app's format
      const user = {
        provider: 'linkedin',
        providerId: id ? String(id) : undefined,
        email: emails?.[0]?.value || emails?.[0] || userProfile?.email,
        name: name 
          ? (typeof name === 'string' 
              ? name 
              : `${name.givenName || name.given_name || ''} ${name.familyName || name.family_name || ''}`.trim())
          : undefined,
        avatar: photos?.[0]?.value || photos?.[0] || userProfile?.picture,
      };
      
      console.log('[LinkedIn Strategy] Normalized user:', {
        provider: user.provider,
        hasProviderId: !!user.providerId,
        hasEmail: !!user.email,
        hasName: !!user.name,
      });
      
      // Pass normalized user to the next step (controller)
      done(null, user);
    } catch (error) {
      console.error('[LinkedIn Strategy] Error in validate:', error);
      console.error('[LinkedIn Strategy] Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      done(error, undefined);
    }
  }
}

