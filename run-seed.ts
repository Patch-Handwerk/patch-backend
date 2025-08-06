import { AppDataSource } from './data-source';
import InitialSurveyDataSeeder from './src/database/seeders/initial-survey-data.seed';

AppDataSource.initialize().then(async () => {
  await new InitialSurveyDataSeeder().run(AppDataSource);
  console.log('Seeding complete!');
  process.exit(0);
});
