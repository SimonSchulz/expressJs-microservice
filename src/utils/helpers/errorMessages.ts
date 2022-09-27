/* eslint-disable no-shadow */
enum ErrorMessages {
  NOT_CLIENT = 'User is not a client',
  NOT_FOUND = 'User not found',
  SUCCESS = 'Succesfully',
  NO_ID = 'If security question is predefined must be a questionID',
  NO_QUESTION = 'If security question is selfDefined must be a question string',
  INVALID_ID = 'Invalid security question ID',
  PASSED_ID = 'Expected security question string,received an ID',
  SAME_PASS = 'Received same password',
  NOT_VERIFIED = 'User not verified',
}

export default ErrorMessages;
