import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHasFinishedOnboarding1773855762 implements MigrationInterface {
  name = 'AddHasFinishedOnboarding1773855762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "has_finished_onboarding" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "has_finished_onboarding"`,
    );
  }
}
