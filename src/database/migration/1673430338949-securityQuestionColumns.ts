import {MigrationInterface, QueryRunner} from "typeorm";

export class securityQuestionColumns1673430338949 implements MigrationInterface {
    name = 'securityQuestionColumns1673430338949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "securityQuestionAttempts" character varying`);
        await queryRunner.query(`ALTER TABLE "client" ADD "securityQuestionLastInvalidAttempt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "securityQuestionLastInvalidAttempt"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "securityQuestionAttempts"`);
    }

}
