import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import Client from '../../entities/client.entity';

define(Client, () => {
  const client = new Client();

  client.mobilePhone = faker.random.numeric(11);
  client.accesionDate = faker.date.past();
  client.firstName = faker.name.firstName();
  client.lastName = faker.name.lastName();
  client.middleName = faker.name.middleName();
  client.passportId = faker.random.numeric(10);
  client.issuanceDate = faker.date.past();
  client.expityDate = faker.date.future();
  client.birthDate = faker.date.birthdate();
  client.smsNotification = faker.helpers.arrayElement([true, false, null]);
  client.emailSubscription = faker.helpers.arrayElement([true, false, null]);
  client.securityQuestion = faker.helpers.arrayElement([
    'Mothers maiden name',
    'Childhood best friend name',
    'Favorite book',
    'Favourite dish',
    'Choose your favorite color',
  ]);
  client.securityQuestionType = faker.helpers.arrayElement(['preDefined', 'selfDefined']);
  client.securityQuestionAnswer = faker.lorem.words(3);
  client.securityQuestionAttempts = faker.random.numeric(1);
  client.securityQuestionLastInvalidAttempt = faker.date.past();
  client.email = faker.internet.email();
  client.password = faker.internet.password();
  return client;
});
