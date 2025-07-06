export const AppConfifuration = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
});