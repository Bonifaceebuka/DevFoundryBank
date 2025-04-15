import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPinColumnToUsersTable1744285205524 implements MigrationInterface {
    name = 'AddedPinColumnToUsersTable1744285205524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "pin" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pin"`);
    }

}
