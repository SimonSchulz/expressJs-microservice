import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1667564718784 implements MigrationInterface {
    name = 'initial1667564718784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."client_clientstatus_enum" AS ENUM('active', 'notActive', 'notRegister', 'closed', 'isClient', 'notClient', 'blocked')`);
        await queryRunner.query(`CREATE TYPE "public"."client_securityquestiontype_enum" AS ENUM('preDefined', 'selfDefined')`);
        await queryRunner.query(`CREATE TABLE "client" ("clientId" uuid NOT NULL DEFAULT uuid_generate_v4(), "mobilePhone" character varying NOT NULL, "clientStatus" "public"."client_clientstatus_enum" NOT NULL DEFAULT 'notRegister', "countryOfResidence" character varying, "accesionDate" TIMESTAMP, "registrationDate" TIMESTAMP, "firstName" character varying(30), "lastName" character varying(30), "middleName" character varying(30), "passportId" character varying, "nationality" character varying, "issuanceDate" TIMESTAMP, "expityDate" TIMESTAMP, "birthDate" TIMESTAMP, "smsNotification" boolean DEFAULT false, "pushNotification" boolean DEFAULT false, "emailSubscription" boolean DEFAULT false, "securityQuestion" character varying(50), "securityQuestionType" "public"."client_securityquestiontype_enum", "securityQuestionId" character varying(50), "securityQuestionAnswer" character varying(100), "email" character varying(50), "password" character varying(255), "refreshToken" character varying, CONSTRAINT "PK_6ed9067942d7537ce359e172ff6" PRIMARY KEY ("clientId"))`);
        await queryRunner.query(`CREATE TABLE "security_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, CONSTRAINT "PK_9698dc8fcc3911faf8e0745a511" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."verification_clientverifstatus_enum" AS ENUM('active', 'blocked')`);
        await queryRunner.query(`CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT ('now'::text)::timestamp(6) with time zone, "clientVerifStatus" "public"."verification_clientverifstatus_enum" NOT NULL DEFAULT 'active', "invalidAttempts" integer DEFAULT '0', "mobilePhone" character varying NOT NULL, "email" character varying, "verificationCode" character varying(6), "lastInvalidAttemptTime" TIMESTAMP WITH TIME ZONE, "codeExpiration" TIMESTAMP WITH TIME ZONE, "lastSentSmsTime" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "verification"`);
        await queryRunner.query(`DROP TYPE "public"."verification_clientverifstatus_enum"`);
        await queryRunner.query(`DROP TABLE "security_question"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TYPE "public"."client_securityquestiontype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."client_clientstatus_enum"`);
    }

}
