import { faker } from '@faker-js/faker';
// import { getRepository } from 'typeorm';
// import SecurityQuestion from '../../entities/security-question.entity';

export const USERS = [];

export function createRandomVerif() {
  return {
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    clientVerifStatus: faker.helpers.arrayElement(['active', 'blocked']),
    invalidAttempts: faker.helpers.arrayElement([0, 1, 2, 3, 4, 5]),
    mobilePhone: faker.random.numeric(11),
    email: faker.internet.email(),
    verificationCode: faker.random.numeric(6),
  };
}

Array.from({ length: 400 }).forEach(() => {
  USERS.push(createRandomVerif());
});
