import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedUsersTable1744720591615 implements MigrationInterface {
    name = 'ModifiedUsersTable1744720591615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97eb875b69327562d36aa7d02b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94a455b74d3a5d162ac001c1d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0870937dbbbf7fe6c45463f3a"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "documentType"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_information_documenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "documentId"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "isBvnVerified"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "isDocumentVerified"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "middle_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "date_of_birth" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "date_of_birth_submitted" TIMESTAMP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_information_document_type_enum" AS ENUM('Int''l Passport', 'Voter''s Card', 'Driver''s License', 'NIN', 'BVN')`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "document_type" "public"."users_kyc_information_document_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "document_id" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_information_status_enum" AS ENUM('active', 'inactive', 'suspended', 'pending', 'banned')`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "status" "public"."users_kyc_information_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD CONSTRAINT "UQ_83eba46f803765c9d86424d28a1" UNIQUE ("bvn")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_80f7ce04c9cc3ab19d58f41d27" ON "users_kyc_information" ("user_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_80f7ce04c9cc3ab19d58f41d27"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP CONSTRAINT "UQ_83eba46f803765c9d86424d28a1"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_information_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "document_id"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "document_type"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_information_document_type_enum"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "date_of_birth_submitted"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "middle_name"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "isDocumentVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "isBvnVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "documentId" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_information_documenttype_enum" AS ENUM('Int''l Passport', 'Voter''s Card', 'Driver''s License', 'NIN')`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "documentType" "public"."users_kyc_information_documenttype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_f0870937dbbbf7fe6c45463f3a" ON "users_kyc_information" ("isDocumentVerified") `);
        await queryRunner.query(`CREATE INDEX "IDX_94a455b74d3a5d162ac001c1d8" ON "users_kyc_information" ("isBvnVerified") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97eb875b69327562d36aa7d02b" ON "users_kyc_information" ("userId") `);
    }

}
