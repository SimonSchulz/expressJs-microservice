import { ClientVerifStatus } from '../../utils/helpers/ClientVerifStatus';
import { ErrorMessages } from '../../utils/helpers/constants';
import { SecurityQuestionsTypes } from '../../utils/helpers/securityQuestionsTypes';
import UserService from '../user.service';

describe('User service', () => {
  class MockedUserService extends UserService {
    mockCheckUserVerification(verifData) {
      if (verifData && verifData.clientVerifStatus && verifData.clientVerifStatus === ClientVerifStatus.ACTIVE) {
        return true;
      }
      return false;
    }
    mockCheckQuestionData(checkId, updateData) {
      if (
        updateData.securityQuestionType === SecurityQuestionsTypes.PREDEFINED &&
        updateData.securityQuestionId &&
        !updateData.securityQuestion &&
        checkId
      ) {
        return true;
      }
      if (
        updateData.securityQuestionType === SecurityQuestionsTypes.SELF_DEFINED &&
        updateData.securityQuestion &&
        !updateData.securityQuestionId &&
        updateData.securityQuestion.length < 30
      ) {
        return true;
      }
      return false;
    }
  }

  const mockedUserService = new MockedUserService();

  describe('handleError', () => {
    it('returns same pass error message', () => {
      const result = mockedUserService.handleError({ passwordCheck: true });
      expect(result).toBe(ErrorMessages.SAME_PASS);
    });
    it('returns not verified error message', () => {
      const result = mockedUserService.handleError({ verifCheck: false });
      expect(result).toBe(ErrorMessages.NOT_VERIFIED);
    });
    it('returns invalid question format error message', () => {
      const result = mockedUserService.handleError({ secQuestTypes: false });
      expect(result).toBe(ErrorMessages.INVALID_QUESTION_FORMAT);
    });
  });

  describe('checkUserVerification', () => {
    test('returns false if no verif data was found', () => {
      const result = mockedUserService.mockCheckUserVerification({});
      expect(result).toBe(false);
    });
    test('returns false client status is not ACTIVE', () => {
      const result = mockedUserService.mockCheckUserVerification({ clientVerifStatus: ClientVerifStatus.BLOCKED });
      expect(result).toBe(false);
    });
    test('returns false clientVerifStatus was not passed', () => {
      const result = mockedUserService.mockCheckUserVerification({ A: 5 });
      expect(result).toBe(false);
    });
    test('returns true if data is valid', () => {
      const result = mockedUserService.mockCheckUserVerification({ ClientVerifStatus: ClientVerifStatus.ACTIVE });
      expect(result).toBe(false);
    });
  });

  describe('check security questions data', () => {
    test('returns false if passed data is whole invalid', () => {
      expect(mockedUserService.mockCheckQuestionData(123, 123)).toBe(false);
    });
    test('questId passed but no such id in db', () => {
      expect(
        mockedUserService.mockCheckQuestionData(false, {
          securityQuestionType: SecurityQuestionsTypes.PREDEFINED,
          securityQuestionId: 123,
        })
      ).toBe(false);
    });
    test('questId passed but type is selfDefined', () => {
      expect(
        mockedUserService.mockCheckQuestionData(true, {
          securityQuestionType: SecurityQuestionsTypes.SELF_DEFINED,
          securityQuestionId: 123,
        })
      ).toBe(false);
    });
    test('questId passed and secQuest passed', () => {
      expect(
        mockedUserService.mockCheckQuestionData(true, {
          securityQuestionType: SecurityQuestionsTypes.SELF_DEFINED,
          securityQuestionId: 123,
          securityQuestion: 'Test question',
        })
      ).toBe(false);
    });
  });
});
