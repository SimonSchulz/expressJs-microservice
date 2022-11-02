import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import SequrityQuestionEntity from '../../entities/security-question.entity';
import { SecurityQuestions } from '../../utils/helpers/constants';

export default class CreateQuestions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.createQueryBuilder().insert().into(SequrityQuestionEntity).values(SecurityQuestions).execute();
  }
}
