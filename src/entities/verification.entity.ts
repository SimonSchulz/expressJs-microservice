import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import ClientVerifStatus from '../utils/helpers/ClientVerifStatus';

@Entity()
class VerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP(6)' })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @Column({ type: 'enum', enum: ClientVerifStatus, default: ClientVerifStatus.ACTIVE })
  clientVerifStatus: ClientVerifStatus;

  @Column({ nullable: true, default: 0 })
  invalidAttempts: number;

  @Column({ nullable: false })
  mobilePhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, length: 6 })
  verificationCode: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastInvalidAttemptTime: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  codeExpiration: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastSentSmsTime: Date;
}

export default VerificationEntity;
