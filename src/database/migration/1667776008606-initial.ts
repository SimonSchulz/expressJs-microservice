import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1667776008606 implements MigrationInterface {
    name = 'initial1667776008606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" RENAME COLUMN "lastSentSmsTime" TO "lastSentEmailTime"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" RENAME COLUMN "lastSentEmailTime" TO "lastSentSmsTime"`);
    }

}
