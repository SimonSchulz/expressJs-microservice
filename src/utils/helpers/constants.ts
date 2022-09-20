/* eslint-disable no-shadow */
const CODE_EXPIRATION_TIME = 15;

export enum ClientStatus {
  ACTIVE = 'active',
  NOT_ACTIVE = 'notActive',
  NOT_REGISTER = 'notRegister',
  CLOSED = 'closed',
  IS_CLIENT = 'isClient',
}

export enum ErrorMessages {
  NOT_CLIENT = 'User is not a client',
  NOT_FOUND = 'User not found',
  SUCCESS = 'Succesfully',
}
