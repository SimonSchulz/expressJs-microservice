import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ClientStatus } from '../utils/helpers/ClientStatus';
import { SecurityQuestionsTypes } from '../utils/helpers/securityQuestionsTypes';

@Entity({ name: 'client'  })
export default class Client {
  @PrimaryGeneratedColumn('uuid')
  clientId: number;

  @Column({ nullable: true })
  mobilePhone: string;

  @Column({ type: 'enum', enum: ClientStatus, default: ClientStatus.NOT_REGISTERED })
  clientStatus: ClientStatus;

  @Column({ nullable: true })
  isResident: string;

  @Column({ nullable: true })
  accesionDate: Date;

  @Column({ nullable: true })
  registrationDate: Date;

  @Column({ nullable: true, length: 30 })
  firstName: string;

  @Column({ nullable: true, length: 30 })
  lastName: string;

  @Column({ nullable: true, length: 30 })
  middleName: string;

  @Column({ nullable: true })
  passportId: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  issuanceDate: Date;

  @Column({ nullable: true })
  expityDate: Date;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true, default: false })
  smsNotification: boolean;

  @Column({ nullable: true, default: false })
  pushNotification: boolean;

  @Column({ nullable: true, default: false })
  emailSubscription: boolean;

  @Column({ length: 50, nullable: true })
  securityQuestion: string;

  @Column({ type: 'enum', enum: SecurityQuestionsTypes, nullable: true })
  securityQuestionType: string;

  @Column({ length: 50, nullable: true })
  securityQuestionId: string;

  @Column({ length: 100, nullable: true })
  securityQuestionAnswer: string;

  @Column({ nullable: true, default: null })
  securityQuestionAttempts: string;

  @Column({ nullable: true })
  securityQuestionLastInvalidAttempt: Date;

  @Column({ length: 50, nullable: true, default: null })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: false })
  isBlocked: boolean;
}
