import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1667775629490 implements MigrationInterface {
    name = 'initial1667775629490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "mobilePhone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "email" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "mobilePhone" SET NOT NULL`);
    }

}
