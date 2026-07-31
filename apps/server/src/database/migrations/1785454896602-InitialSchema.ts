import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1785454896602 implements MigrationInterface {
	name = "InitialSchema1785454896602";

	public async up(queryRunner: QueryRunner): Promise<void> {
		// synchronize la creaba implícitamente; sin ella los DEFAULT uuid_generate_v4() fallan.
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
		await queryRunner.query(
			`CREATE TABLE "shop" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_2a9ff9365c71ef03b0d6f710a05" PRIMARY KEY ("_id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "user" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "role" character varying NOT NULL, "shop_id" uuid, CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "account" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, "user_id" uuid, CONSTRAINT "REL_efef1e5fdbe318a379c06678c5" UNIQUE ("user_id"), CONSTRAINT "PK_f2adb00e45577be909681ed9a23" PRIMARY KEY ("_id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."incident_module_enum" AS ENUM('auth', 'incidents', 'shops', 'users')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."incident_type_enum" AS ENUM('INFO', 'WARNING', 'ERROR')`,
		);
		await queryRunner.query(
			`CREATE TABLE "incident" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "module" "public"."incident_module_enum" NOT NULL, "action" character varying NOT NULL, "type" "public"."incident_type_enum" NOT NULL DEFAULT 'INFO', "meta" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_db2648e7fd9d97b50388b5f87e8" PRIMARY KEY ("_id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ADD CONSTRAINT "FK_f8ccf35fe3e1b328839cd8e2395" FOREIGN KEY ("shop_id") REFERENCES "shop"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "account" ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "incident" ADD CONSTRAINT "FK_65cd11b3394e92b044f5b1140c2" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "incident" DROP CONSTRAINT "FK_65cd11b3394e92b044f5b1140c2"`,
		);
		await queryRunner.query(
			`ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" DROP CONSTRAINT "FK_f8ccf35fe3e1b328839cd8e2395"`,
		);
		await queryRunner.query(`DROP TABLE "incident"`);
		await queryRunner.query(`DROP TYPE "public"."incident_type_enum"`);
		await queryRunner.query(`DROP TYPE "public"."incident_module_enum"`);
		await queryRunner.query(`DROP TABLE "account"`);
		await queryRunner.query(`DROP TABLE "user"`);
		await queryRunner.query(`DROP TABLE "shop"`);
	}
}
