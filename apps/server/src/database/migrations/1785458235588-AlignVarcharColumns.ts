import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Las bases creadas por `synchronize` tienen estas columnas como varchar(255),
 * mientras que las entidades resuelven a varchar sin longitud.
 *
 * El generador propone DROP COLUMN + ADD COLUMN, que borraría los datos.
 * ALTER COLUMN ... TYPE hace el mismo cambio conservándolos.
 */
export class AlignVarcharColumns1785458235588 implements MigrationInterface {
	name = "AlignVarcharColumns1785458235588";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "shop" ALTER COLUMN "name" TYPE character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ALTER COLUMN "email" TYPE character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ALTER COLUMN "name" TYPE character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ALTER COLUMN "role" TYPE character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "account" ALTER COLUMN "password" TYPE character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "incident" ALTER COLUMN "action" TYPE character varying`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Estrechar el tipo falla si algún valor supera los 255 caracteres.
		await queryRunner.query(
			`ALTER TABLE "incident" ALTER COLUMN "action" TYPE character varying(255)`,
		);
		await queryRunner.query(
			`ALTER TABLE "account" ALTER COLUMN "password" TYPE character varying(255)`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ALTER COLUMN "role" TYPE character varying(255)`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ALTER COLUMN "name" TYPE character varying(255)`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ALTER COLUMN "email" TYPE character varying(255)`,
		);
		await queryRunner.query(
			`ALTER TABLE "shop" ALTER COLUMN "name" TYPE character varying(255)`,
		);
	}
}
