import {MigrationInterface, QueryRunner} from "typeorm";

export class secretQuestionCheck1673898905603 implements MigrationInterface {
    name = 'secretQuestionCheck1673898905603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "securityQuestionAvailableAttempts" integer`);
        await queryRunner.query(`ALTER TABLE "client" ADD "securityQuestionIncorrectInputTime" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "securityQuestionIncorrectInputTime"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "securityQuestionAvailableAttempts"`);
    }

}
