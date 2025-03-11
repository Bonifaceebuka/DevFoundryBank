import { MigrationInterface, QueryRunner } from "typeorm";

export class PreviousMigrations1741689398090 implements MigrationInterface {
    name = 'PreviousMigrations1741689398090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_withdrawal_information_currency_enum" AS ENUM('NGN')`);
        await queryRunner.query(`CREATE TABLE "users_withdrawal_information" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "currency" "public"."users_withdrawal_information_currency_enum" NOT NULL DEFAULT 'NGN', "bankCode" character varying NOT NULL, "bankName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "accountName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_87cc750d0cd0343c0fe87997d31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f7c647e31739b233d3d18a7f04" ON "users_withdrawal_information" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_00a1eda6df532833e6ec212275" ON "users_withdrawal_information" ("currency") `);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_information_documenttype_enum" AS ENUM('Int''l Passport', 'Voter''s Card', 'Driver''s License', 'NIN')`);
        await queryRunner.query(`CREATE TABLE "users_kyc_information" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "bvn" character varying NOT NULL, "documentType" "public"."users_kyc_information_documenttype_enum" NOT NULL, "documentId" character varying NOT NULL, "isBvnVerified" boolean NOT NULL DEFAULT false, "isDocumentVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91d6feb23c47c198818757af539" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97eb875b69327562d36aa7d02b" ON "users_kyc_information" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_94a455b74d3a5d162ac001c1d8" ON "users_kyc_information" ("isBvnVerified") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0870937dbbbf7fe6c45463f3a" ON "users_kyc_information" ("isDocumentVerified") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdb93958ad386923eb894fb280" ON "users_kyc_information" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_02bcf444667eb66fc5981a3022" ON "users_kyc_information" ("lastUpdatedAt") `);
        await queryRunner.query(`CREATE TYPE "public"."users_next_of_kin_relationship_enum" AS ENUM('father', 'mother', 'brother', 'sister', 'uncle', 'aunt', 'cousin', 'nephew', 'niece', 'son', 'daugther')`);
        await queryRunner.query(`CREATE TABLE "users_next_of_kin" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "address" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying, "relationship" "public"."users_next_of_kin_relationship_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b6ffa42e6f3d91647da14ca5afc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_906f092a40245b02386d4ca6a3" ON "users_next_of_kin" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ceb76b736ff70a590980b6614c" ON "users_next_of_kin" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_7d02dee1ca22b3d00ee0c568a8" ON "users_next_of_kin" ("lastUpdatedAt") `);
        await queryRunner.query(`CREATE TABLE "state_lgas" ("id" SERIAL NOT NULL, "state" character varying NOT NULL, "lga" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed126f2fa946f6f9c98cbf4c220" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_00f1eff09db3280dd52f46f9e3" ON "state_lgas" ("state") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "address" character varying, "phoneNumber" character varying, "stateLgaId" integer, "profilePicture" character varying, "tier" integer NOT NULL DEFAULT '1', "pin" character varying, "otp" character varying, "isValidated" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, "isEnabled" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e35ffc30e351cf20ec62ce7c4" ON "users" ("tier") `);
        await queryRunner.query(`CREATE INDEX "IDX_d81f1d3b3ff2007a84ef1c97dd" ON "users" ("isValidated") `);
        await queryRunner.query(`CREATE INDEX "IDX_409a0298fdd86a6495e23c25c6" ON "users" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_f59d4484a910f04eab2c1f4a5a" ON "users" ("isEnabled") `);
        await queryRunner.query(`CREATE INDEX "IDX_fb21a8f1ce1641e7328f36968b" ON "users" ("isDeleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_204e9b624861ff4a5b26819210" ON "users" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a128796a4f641529bb21ee9cf" ON "users" ("lastUpdatedAt") `);
        await queryRunner.query(`CREATE TYPE "public"."banks_currency_enum" AS ENUM('NGN')`);
        await queryRunner.query(`CREATE TABLE "banks" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "currency" "public"."banks_currency_enum" NOT NULL DEFAULT 'NGN', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_337dd3f2308d7c154612e14196" ON "banks" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_bc680de8ba9d7878fddcecd610" ON "banks" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_b429aa70d304e03aff0431d6c1" ON "banks" ("currency") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1ec61b621ae9e2ef98f36fbfc54" FOREIGN KEY ("stateLgaId") REFERENCES "state_lgas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1ec61b621ae9e2ef98f36fbfc54"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b429aa70d304e03aff0431d6c1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc680de8ba9d7878fddcecd610"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_337dd3f2308d7c154612e14196"`);
        await queryRunner.query(`DROP TABLE "banks"`);
        await queryRunner.query(`DROP TYPE "public"."banks_currency_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a128796a4f641529bb21ee9cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_204e9b624861ff4a5b26819210"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb21a8f1ce1641e7328f36968b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f59d4484a910f04eab2c1f4a5a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_409a0298fdd86a6495e23c25c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d81f1d3b3ff2007a84ef1c97dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e35ffc30e351cf20ec62ce7c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00f1eff09db3280dd52f46f9e3"`);
        await queryRunner.query(`DROP TABLE "state_lgas"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d02dee1ca22b3d00ee0c568a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ceb76b736ff70a590980b6614c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_906f092a40245b02386d4ca6a3"`);
        await queryRunner.query(`DROP TABLE "users_next_of_kin"`);
        await queryRunner.query(`DROP TYPE "public"."users_next_of_kin_relationship_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02bcf444667eb66fc5981a3022"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdb93958ad386923eb894fb280"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0870937dbbbf7fe6c45463f3a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94a455b74d3a5d162ac001c1d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97eb875b69327562d36aa7d02b"`);
        await queryRunner.query(`DROP TABLE "users_kyc_information"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_information_documenttype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00a1eda6df532833e6ec212275"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f7c647e31739b233d3d18a7f04"`);
        await queryRunner.query(`DROP TABLE "users_withdrawal_information"`);
        await queryRunner.query(`DROP TYPE "public"."users_withdrawal_information_currency_enum"`);
    }

}
