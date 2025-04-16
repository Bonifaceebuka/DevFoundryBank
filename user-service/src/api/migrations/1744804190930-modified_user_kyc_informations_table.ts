import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedUserKycInformationsTable1744804190930 implements MigrationInterface {
    name = 'ModifiedUserKycInformationsTable1744804190930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP CONSTRAINT "UQ_83eba46f803765c9d86424d28a1"`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" DROP COLUMN "bvn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD "bvn" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_kyc_information" ADD CONSTRAINT "UQ_83eba46f803765c9d86424d28a1" UNIQUE ("bvn")`);
    }

}
