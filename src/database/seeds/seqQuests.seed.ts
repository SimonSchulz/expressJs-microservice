import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import SequrityQuestionsEntity from '../../entities/seqQuests.entity';
import { SecurityQuestions } from '../../utils/helpers/constants';

export default class CreateQuestions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.createQueryBuilder().insert().into(SequrityQuestionsEntity).values(SecurityQuestions).execute();
  }
}
