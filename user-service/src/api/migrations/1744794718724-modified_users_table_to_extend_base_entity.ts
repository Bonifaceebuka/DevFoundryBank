import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedUsersTableToExtendBaseEntity1744794718724 implements MigrationInterface {
    name = 'ModifiedUsersTableToExtendBaseEntity1744794718724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "pin" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pin"`);
    }

}
