export const JwtConfiguration = () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
});