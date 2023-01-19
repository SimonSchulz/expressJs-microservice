import {MigrationInterface, QueryRunner} from "typeorm";

export class avatarField1674133737480 implements MigrationInterface {
    name = 'avatarField1674133737480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "avatar"`);
    }

}
