import {MigrationInterface, QueryRunner} from "typeorm";

export class replaceSMSwithEmail1669133684805 implements MigrationInterface {
    name = 'replaceSMSwithEmail1669133684805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "lastSentSmsTime"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "lastSentEmailTime" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "mobilePhone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "email" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "mobilePhone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "lastSentEmailTime"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "lastSentSmsTime" TIMESTAMP WITH TIME ZONE`);
    }

}
