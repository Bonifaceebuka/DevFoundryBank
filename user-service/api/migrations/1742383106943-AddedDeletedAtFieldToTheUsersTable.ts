import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDeletedAtFieldToTheUsersTable1742383106943 implements MigrationInterface {
    name = 'AddedDeletedAtFieldToTheUsersTable1742383106943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_c0d176bcc1665dc7cb60482c817" UNIQUE ("password_reset_token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_c0d176bcc1665dc7cb60482c817"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    }

}
