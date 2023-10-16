import { MigrationInterface, QueryRunner } from "typeorm";

export class PersonUpdate1697463287381 implements MigrationInterface {
  name = "PersonUpdate1697463287381";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" ADD "image" character varying`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."person_gender_enum" AS ENUM('MALE', 'FEMALE', 'UNKNOWN')`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD "gender" "public"."person_gender_enum" NOT NULL DEFAULT 'UNKNOWN'`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD "isPublic" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "isPublic"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "gender"`);
    await queryRunner.query(`DROP TYPE "public"."person_gender_enum"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "image"`);
  }
}
