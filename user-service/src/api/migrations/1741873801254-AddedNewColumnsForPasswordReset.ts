import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNewColumnsForPasswordReset1741873801254 implements MigrationInterface {
    name = 'AddedNewColumnsForPasswordReset1741873801254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password_reset_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "token_expires_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token_expires_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_reset_token"`);
    }

}
