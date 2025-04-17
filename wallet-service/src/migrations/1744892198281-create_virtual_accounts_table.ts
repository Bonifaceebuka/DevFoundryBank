import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVirtualAccountsTable1744892198281 implements MigrationInterface {
    name = 'CreateVirtualAccountsTable1744892198281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "virtual_accounts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying NOT NULL, "account_name" character varying NOT NULL, "account_number" character varying NOT NULL, CONSTRAINT "PK_cf97c457f495033bd0cdcb70949" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "virtual_accounts"`);
    }

}
