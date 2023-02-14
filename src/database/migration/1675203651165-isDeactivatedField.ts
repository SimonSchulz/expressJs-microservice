import {MigrationInterface, QueryRunner} from "typeorm";

export class isDeactivatedField1675203651165 implements MigrationInterface {
    name = 'isDeactivatedField1675203651165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "isDeactivated" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isDeactivated"`);
    }

}
