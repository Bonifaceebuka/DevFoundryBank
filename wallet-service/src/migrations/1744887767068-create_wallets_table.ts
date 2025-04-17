import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWalletsTable1744887767068 implements MigrationInterface {
    name = 'CreateWalletsTable1744887767068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."wallets_status_enum" AS ENUM('active', 'inactive', 'suspended', 'pending', 'banned')`);
        await queryRunner.query(`CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying NOT NULL, "balance" numeric(10,4) NOT NULL DEFAULT '0', "status" "public"."wallets_status_enum" NOT NULL DEFAULT 'pending', "transaction_pin" character varying NOT NULL, CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TYPE "public"."wallets_status_enum"`);
    }

}
