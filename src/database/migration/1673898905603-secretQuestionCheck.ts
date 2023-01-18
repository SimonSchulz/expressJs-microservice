import {MigrationInterface, QueryRunner} from "typeorm";

export class secretQuestionCheck1673898905603 implements MigrationInterface {
    name = 'secretQuestionCheck1673898905603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "secQuestionValidAttempts" integer`);
        await queryRunner.query(`ALTER TABLE "client" ADD "lastSecQuestionInvalidAttemptTime" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "lastSecQuestionInvalidAttemptTime"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "secQuestionValidAttempts"`);
    }

}
