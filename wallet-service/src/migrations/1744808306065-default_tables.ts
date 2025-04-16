import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTables1744808306065 implements MigrationInterface {
    name = 'DefaultTables1744808306065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_withdrawal_information_currency_enum" AS ENUM('NGN')`);
        await queryRunner.query(`CREATE TABLE "users_withdrawal_information" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "currency" "public"."users_withdrawal_information_currency_enum" NOT NULL DEFAULT 'NGN', "bankCode" character varying NOT NULL, "bankName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "accountName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_87cc750d0cd0343c0fe87997d31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f7c647e31739b233d3d18a7f04" ON "users_withdrawal_information" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_00a1eda6df532833e6ec212275" ON "users_withdrawal_information" ("currency") `);
        await queryRunner.query(`CREATE TYPE "public"."banks_currency_enum" AS ENUM('NGN')`);
        await queryRunner.query(`CREATE TABLE "banks" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "currency" "public"."banks_currency_enum" NOT NULL DEFAULT 'NGN', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_337dd3f2308d7c154612e14196" ON "banks" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_bc680de8ba9d7878fddcecd610" ON "banks" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_b429aa70d304e03aff0431d6c1" ON "banks" ("currency") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b429aa70d304e03aff0431d6c1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc680de8ba9d7878fddcecd610"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_337dd3f2308d7c154612e14196"`);
        await queryRunner.query(`DROP TABLE "banks"`);
        await queryRunner.query(`DROP TYPE "public"."banks_currency_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00a1eda6df532833e6ec212275"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f7c647e31739b233d3d18a7f04"`);
        await queryRunner.query(`DROP TABLE "users_withdrawal_information"`);
        await queryRunner.query(`DROP TYPE "public"."users_withdrawal_information_currency_enum"`);
    }

}
