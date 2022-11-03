import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import VerificationEntity from '../../entities/verification.entity';

define(VerificationEntity, () => {
  const verifClient = new VerificationEntity();
  verifClient.createdAt = faker.date.past();
  verifClient.updatedAt = faker.date.past();
  verifClient.invalidAttempts = faker.helpers.arrayElement([0, 1, 2, 3, 4, 5]);
  verifClient.mobilePhone = faker.random.numeric(11);
  verifClient.email = faker.internet.email();
  verifClient.verificationCode = faker.random.numeric(6);

  return verifClient;
});
