import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedUsersTableToExtendBaseEntity1744793610021 implements MigrationInterface {
    name = 'ModifiedUsersTableToExtendBaseEntity1744793610021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pin"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pk" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_7a581eb064d1111c3ba96f300d5" PRIMARY KEY ("id", "pk")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_7a581eb064d1111c3ba96f300d5"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_be2c939b44777147d26475d7b76" PRIMARY KEY ("pk")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433" UNIQUE ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_be2c939b44777147d26475d7b76"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_7a581eb064d1111c3ba96f300d5" PRIMARY KEY ("id", "pk")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_7a581eb064d1111c3ba96f300d5"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pk"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pin" character varying`);
    }

}
