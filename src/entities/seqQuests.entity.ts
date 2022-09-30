import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class SecurityQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  question: string;
  static PREDEFINED: string;
}

export default SecurityQuestionEntity;
