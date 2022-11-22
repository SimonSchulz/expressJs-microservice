import {MigrationInterface, QueryRunner} from "typeorm";

export class editClient1669124646077 implements MigrationInterface {
    name = 'editClient1669124646077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "countryOfResidence"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "isResident" character varying`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "mobilePhone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "mobilePhone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "mobilePhone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "mobilePhone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isResident"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "countryOfResidence" character varying`);
    }

}
