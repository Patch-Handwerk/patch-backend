import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTranslationStrings1773849181980 implements MigrationInterface {
  name = 'AddTranslationStrings1773849181980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // phases
    await queryRunner.query(
      `ALTER TABLE "phases" ADD "translationKey" character varying`,
    );

    // sub_phases
    await queryRunner.query(
      `ALTER TABLE "sub_phases" ADD "translationKey" character varying`,
    );

    // questions
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "translationKey" character varying`,
    );

    // answers — three new key columns
    await queryRunner.query(
      `ALTER TABLE "answers" ADD "answerTranslationKey" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD "stageKey" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD "descriptionKey" character varying`,
    );

    // stages
    await queryRunner.query(
      `ALTER TABLE "stages" ADD "translationKey" character varying`,
    );

    // results — two new key columns
    await queryRunner.query(
      `ALTER TABLE "results" ADD "stageKey" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD "descriptionKey" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "results" DROP COLUMN "descriptionKey"`,
    );
    await queryRunner.query(`ALTER TABLE "results" DROP COLUMN "stageKey"`);
    await queryRunner.query(
      `ALTER TABLE "stages" DROP COLUMN "translationKey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP COLUMN "descriptionKey"`,
    );
    await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "stageKey"`);
    await queryRunner.query(
      `ALTER TABLE "answers" DROP COLUMN "answerTranslationKey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP COLUMN "translationKey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_phases" DROP COLUMN "translationKey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "phases" DROP COLUMN "translationKey"`,
    );
  }
}
