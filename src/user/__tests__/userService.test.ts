import { describe, expect } from '@jest/globals';
import Client from '../../entities/client.entity';
import SecurityQuestion from '../../entities/security-question.entity';
import UserService from '../user.service';

const userData: Client = new Client();
const questionData: SecurityQuestion = new SecurityQuestion();

describe('UserService', () => {
  describe('getUser', () => {
    jest.spyOn(UserService.prototype, 'getUser').mockReturnValueOnce(Promise.resolve(userData));

    it('should return userData by email', async () => {
      const user = await new UserService().getUser({ email: userData.email });
      expect(user).toBe(userData);
    });
  });

  describe('checkSecQuestionId', () => {
    jest.spyOn(UserService.prototype, 'checkSecQuestionId').mockReturnValueOnce(Promise.resolve(questionData));

    it('should return questionData by id', async () => {
      const question = await new UserService().checkSecQuestionId(questionData.id);
      expect(question).toBe(questionData);
    });
  });

  describe('checkUserVerification', () => {
    jest.spyOn(UserService.prototype, 'checkUserVerification').mockReturnValueOnce(Promise.resolve(false));

    it('should return false when user not verified', async () => {
      const isUserVerify = await new UserService().checkUserVerification(Client);
      expect(isUserVerify).toBe(false);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
