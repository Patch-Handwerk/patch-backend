export const OAuthConfiguration = () => ({
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
  },
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL:
      process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3001/auth/linkedin/callback',
    scope: (process.env.LINKEDIN_SCOPE || 'openid profile email').split(' '),
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:
      process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/auth/github/callback',
    scope: (process.env.GITHUB_SCOPE || 'user:email').split(' '),
  },
  frontendRedirectUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
});




