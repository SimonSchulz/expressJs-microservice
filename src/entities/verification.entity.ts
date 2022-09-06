import { Max, Min } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class VerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP(6)' })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  // @UpdateDateColumn({
  //   type: 'timestamp',
  //   nullable: true,
  //   default: () => 'CURRENT_TIMESTAMP(6)',
  //   onUpdate: 'CURRENT_TIMESTAMP(6)',
  // })
  // public codeExpiration: Date;

  // @Column({ nullable: false, default: 0, min: 0, max: 5 })
  // public tries: number;

  @Column({ nullable: true, default: 0 })
  @Min(0)
  @Max(5)
  tries: number;

  @Column({ nullable: false })
  mobilePhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, length: 6 })
  verificationCode: string;
}

export default VerificationEntity;
