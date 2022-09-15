import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class SequrityQuestionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  question: string;
}

export default SequrityQuestionsEntity;
