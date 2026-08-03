import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsBase1785537341552 implements MigrationInterface {
    name = 'ProductsBase1785537341552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "shop_id" uuid NOT NULL, CONSTRAINT "UQ_84b7b65fee214d8bd1ced35e0f6" UNIQUE ("_id", "shop_id"), CONSTRAINT "PK_5b9ac08c965a3293bb3af89f4e0" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8640881ca9f8e09264432a4ee1" ON "location"  ("shop_id") `);
        await queryRunner.query(`CREATE TABLE "category" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "shop_id" uuid NOT NULL, CONSTRAINT "UQ_24d6ca85ecee6000ea70357b37f" UNIQUE ("_id", "shop_id"), CONSTRAINT "PK_0d6721292a14c4041a79fb021fb" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4b747012fa43361e5300d1cfdc" ON "category"  ("shop_id") `);
        await queryRunner.query(`CREATE TABLE "product" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "shop_id" uuid NOT NULL, "category_id" uuid, "imageURL" character varying, CONSTRAINT "UQ_ef1463747493c301f52e1b3d179" UNIQUE ("_id", "shop_id"), CONSTRAINT "PK_48a340498988303028eec5c4c4f" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4a3fbcf31d8e5b56e82218673d" ON "product"  ("shop_id") `);
        await queryRunner.query(`CREATE TABLE "product_location" ("product_id" uuid NOT NULL, "location_id" uuid NOT NULL, "shop_id" uuid NOT NULL, "stock" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_571aabb2b14da661a359e7a3472" PRIMARY KEY ("product_id", "location_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d525970c8350db4114c253a8e2" ON "product_location"  ("shop_id") `);
        await queryRunner.query(`ALTER TYPE "public"."incident_module_enum" ADD VALUE 'locations'`);
        await queryRunner.query(`ALTER TYPE "public"."incident_module_enum" ADD VALUE 'products'`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_8640881ca9f8e09264432a4ee1a" FOREIGN KEY ("shop_id") REFERENCES "shop"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_4b747012fa43361e5300d1cfdc4" FOREIGN KEY ("shop_id") REFERENCES "shop"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_4a3fbcf31d8e5b56e82218673d8" FOREIGN KEY ("shop_id") REFERENCES "shop"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_faca5822745e9728582f983cb51" FOREIGN KEY ("category_id", "shop_id") REFERENCES "category"("_id","shop_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_location" ADD CONSTRAINT "FK_13a9399f47fb650f2e347bbcada" FOREIGN KEY ("product_id", "shop_id") REFERENCES "product"("_id","shop_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_location" ADD CONSTRAINT "FK_2e83c2495de952d499c945285e3" FOREIGN KEY ("location_id", "shop_id") REFERENCES "location"("_id","shop_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_location" DROP CONSTRAINT "FK_2e83c2495de952d499c945285e3"`);
        await queryRunner.query(`ALTER TABLE "product_location" DROP CONSTRAINT "FK_13a9399f47fb650f2e347bbcada"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_faca5822745e9728582f983cb51"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_4a3fbcf31d8e5b56e82218673d8"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_4b747012fa43361e5300d1cfdc4"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_8640881ca9f8e09264432a4ee1a"`);
        await queryRunner.query(`CREATE TYPE "public"."incident_module_enum_old" AS ENUM('auth', 'incidents', 'shops', 'users')`);
        await queryRunner.query(`ALTER TABLE "incident" ALTER COLUMN "module" TYPE "public"."incident_module_enum_old" USING "module"::"text"::"public"."incident_module_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."incident_module_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."incident_module_enum_old" RENAME TO "incident_module_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d525970c8350db4114c253a8e2"`);
        await queryRunner.query(`DROP TABLE "product_location"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a3fbcf31d8e5b56e82218673d"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b747012fa43361e5300d1cfdc"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8640881ca9f8e09264432a4ee1"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
