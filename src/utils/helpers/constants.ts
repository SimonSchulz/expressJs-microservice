import { UpdateUserPasswordDto } from '../../login/dto/UpdateUserPassword.dto';
import { MobilePhoneDto } from '../../registration/dto/mobilePhone.dto';
import { RegistrationDataDto } from '../../registration/dto/registrationData.dto';
import { UpdateUserProfileDto } from '../../registration/dto/updateData.dto';

const CODE_EXPIRATION_TIME = 15;

// eslint-disable-next-line no-shadow
export enum ClientStatus {
  ACTIVE = 'active',
  NOT_ACTIVE = 'notActive',
  NOT_REGISTER = 'notRegister',
  CLOSED = 'closed',
  BLOCKED = 'blocked',
  IS_CLIENT = 'isClient',
}

export enum ErrorMessages {
  NOT_CLIENT = 'Is not a client',
  NOT_FOUND = 'User not found',
  EMPTY_REQ_BODY = 'Empty request body',
  ALREADY_EXISTS = 'User already exists',
  SUCCESS = 'Success',
  SAME_PASSWORD = 'Password is the same as was or old password is different',
}

export const Endpoints = {
  '/registration': MobilePhoneDto,
  '/registration/user-profile': UpdateUserProfileDto,
  '/registration/user-profile/new': RegistrationDataDto,
  '/login/password': UpdateUserPasswordDto,
};

export const SecurityQuestions = [
  { question: `Mother's maiden name` },
  { question: 'Childhood best friend name' },
  { question: 'Favorite book' },
  { question: 'Favourite dish' },
  { question: 'Choose your favorite color' },
  { question: 'Write your question' },
];
