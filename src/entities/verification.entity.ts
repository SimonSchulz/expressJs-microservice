import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class VerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  mobilePhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false, length: 6 })
  verificationCode: string;
}

export default VerificationEntity;
