import { MigrationInterface, QueryRunner } from "typeorm";

export class LocationsMetadata1785614626365 implements MigrationInterface {
    name = 'LocationsMetadata1785614626365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "location" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "address"`);
    }

}
