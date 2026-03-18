import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1770219014589 implements MigrationInterface {
  name = 'InitialSchema1770219014589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phases" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e93bb53460b28d4daf72735d5d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" SERIAL NOT NULL, "answer" character varying NOT NULL, "is_stop_answer" boolean, "point" integer NOT NULL, "level" integer, "stage" character varying, "description" character varying, "questionId" integer, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "sortId" integer NOT NULL, "sub_phase_id" integer, CONSTRAINT "REL_5e86d5f05e74fe828cb717b2ef" UNIQUE ("sub_phase_id"), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_phases" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "parent_phase_id" integer, CONSTRAINT "PK_b8fca02cb0e88c35daa27ac3fae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('consultant', 'craftsman', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_user_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'consultant', "user_status" "public"."users_user_status_enum" NOT NULL DEFAULT 'pending', "reset_token" character varying, "reset_token_expiry" TIMESTAMP, "is_verified" boolean NOT NULL DEFAULT false, "verification_token" character varying, "verification_token_expiry" TIMESTAMP, "refresh_token" text, "provider" character varying, "provider_id" character varying, "avatar" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "results" ("id" SERIAL NOT NULL, "user_id" integer, "total_points" integer NOT NULL DEFAULT '0', "progress" character varying, "level" integer, "stage" character varying, "description" character varying, "phase_name" character varying, "subphase_name" character varying, "question_id" integer, "selected_answer_text" character varying, "selected_answer_point" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "answer_id" integer, CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stages" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "minimum_to_achieve" integer, "maximum_to_achieve" integer, CONSTRAINT "PK_16efa0f8f5386328944769b9e6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_5e86d5f05e74fe828cb717b2ef6" FOREIGN KEY ("sub_phase_id") REFERENCES "sub_phases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_phases" ADD CONSTRAINT "FK_82dc7bd29b47aebabe44dd19091" FOREIGN KEY ("parent_phase_id") REFERENCES "phases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_aca374b0116514f1a768c67e5d7" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_08b8f644e3b243fe8cb8c7498e8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_08b8f644e3b243fe8cb8c7498e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_aca374b0116514f1a768c67e5d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_phases" DROP CONSTRAINT "FK_82dc7bd29b47aebabe44dd19091"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_5e86d5f05e74fe828cb717b2ef6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`,
    );
    await queryRunner.query(`DROP TABLE "stages"`);
    await queryRunner.query(`DROP TABLE "results"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_user_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "sub_phases"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "answers"`);
    await queryRunner.query(`DROP TABLE "phases"`);
  }
}
