import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWalletsTable1744891356466 implements MigrationInterface {
    name = 'UpdateWalletsTable1744891356466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" ALTER COLUMN "transaction_pin" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" ALTER COLUMN "transaction_pin" SET NOT NULL`);
    }

}
