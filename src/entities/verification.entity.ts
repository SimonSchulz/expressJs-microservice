import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class VerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @Column({ nullable: false })
  mobilePhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, length: 6 })
  verificationCode: string;
}

export default VerificationEntity;
