import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedUserKycInformationsTable1744802702548 implements MigrationInterface {
    name = 'ModifiedUserKycInformationsTable1744802702548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_fdb93958ad386923eb894fb280"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02bcf444667eb66fc5981a3022"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_80f7ce04c9cc3ab19d58f41d27"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "lastUpdatedAt"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_information_tier_enum" AS ENUM('tier1', 'tier2')`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "tier" "public"."users_kyc_information_tier_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD CONSTRAINT "UQ_80f7ce04c9cc3ab19d58f41d277" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD CONSTRAINT "FK_80f7ce04c9cc3ab19d58f41d277" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP CONSTRAINT "FK_80f7ce04c9cc3ab19d58f41d277"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP CONSTRAINT "UQ_80f7ce04c9cc3ab19d58f41d277"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "tier"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_information_tier_enum"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_80f7ce04c9cc3ab19d58f41d27" ON "users_kyc_information" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_02bcf444667eb66fc5981a3022" ON "users_kyc_information" ("lastUpdatedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdb93958ad386923eb894fb280" ON "users_kyc_information" ("createdAt") `);
    }

}
