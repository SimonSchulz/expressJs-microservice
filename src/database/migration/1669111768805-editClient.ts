import {MigrationInterface, QueryRunner} from "typeorm";

export class editClient1669111768805 implements MigrationInterface {
    name = 'editClient1669111768805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."client_clientstatus_enum" RENAME TO "client_clientstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."client_clientstatus_enum" AS ENUM('registered', 'notRegister')`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "clientStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "clientStatus" TYPE "public"."client_clientstatus_enum" USING "clientStatus"::"text"::"public"."client_clientstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "clientStatus" SET DEFAULT 'notRegister'`);
        await queryRunner.query(`DROP TYPE "public"."client_clientstatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."client_clientstatus_enum_old" AS ENUM('active', 'notActive', 'notRegister', 'closed', 'isClient', 'notClient', 'blocked')`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "clientStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "clientStatus" TYPE "public"."client_clientstatus_enum_old" USING "clientStatus"::"text"::"public"."client_clientstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "clientStatus" SET DEFAULT 'notRegister'`);
        await queryRunner.query(`DROP TYPE "public"."client_clientstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."client_clientstatus_enum_old" RENAME TO "client_clientstatus_enum"`);
    }

}
