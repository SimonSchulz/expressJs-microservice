import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
<<<<<<< HEAD
import ClientStatus from '../utils/helpers/ClientStatus';
=======
import { ClientStatus } from '../utils/helpers/constants';
>>>>>>> 77b5df50bf688fe373b1315dc8686882f4ef9f62

@Entity()
export default class Client {
  @PrimaryGeneratedColumn('uuid')
  clientId: number;

  @Column({ nullable: false })
  mobilePhone: string;

  @Column({ type: 'enum', enum: ClientStatus, default: ClientStatus.NOT_REGISTER })
  clientStatus: ClientStatus;

  @Column({ nullable: true })
  countryOfResidence: string;

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

  @Column({ length: 50, nullable: true })
  securityAnswer: string;

  @Column({ length: 50, nullable: true, default: null })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;
}
