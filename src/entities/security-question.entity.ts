import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class SecurityQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  question: string;
}
