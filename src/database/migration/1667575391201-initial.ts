import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1667575391201 implements MigrationInterface {
    name = 'initial1667575391201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "mobilePhone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "mobilePhone" SET NOT NULL`);
    }

}
