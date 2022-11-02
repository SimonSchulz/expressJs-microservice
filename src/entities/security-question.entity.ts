import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'security_question' })
export default class SecurityQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  question: string;
}
