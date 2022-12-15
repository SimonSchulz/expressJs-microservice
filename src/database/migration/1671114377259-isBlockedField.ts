import {MigrationInterface, QueryRunner} from "typeorm";

export class isBlockedField1671114377259 implements MigrationInterface {
    name = 'isBlockedField1671114377259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "isBlocked" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isBlocked"`);
    }

}
