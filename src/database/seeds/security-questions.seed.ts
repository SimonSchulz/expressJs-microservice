import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import SequrityQuestionEntity from '../../entities/security-question.entity';
import VerificationEntity from '../../entities/verification.entity';
import Client from '../../entities/client.entity';
import { SecurityQuestions } from '../../utils/helpers/constants';

export default class CreateQuestions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Client)().createMany(100);
    await connection.createQueryBuilder().insert().into(SequrityQuestionEntity).values(SecurityQuestions).execute();
  }
}
