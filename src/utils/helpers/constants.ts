import { MobilePhoneDto } from '../../registration/dto/mobilePhone.dto';
import UpdateUserProfileDto from '../../registration/dto/updateData.dto';

const CODE_EXPIRATION_TIME = 15;

// eslint-disable-next-line no-shadow
export enum ClientStatus {
  ACTIVE = 'active',
  NOT_ACTIVE = 'notActive',
  NOT_REGISTER = 'notRegister',
  CLOSED = 'closed',
  IS_CLIENT = 'isClient',
  BLOCKED = 'blocked',
}

export enum ErrorMessages {
  ERROR = 'Error',
  NOT_CLIENT = 'notClient',
  IS_CLIENT = 'isClient',
  NOT_FOUND = 'notFound',
  SUCCESS = 'success',
}

export const Endpoints = {
  '/registration': MobilePhoneDto,
  '/registration/user-profile': UpdateUserProfileDto,
};
export const SecurityQuestions = [
  { question: `Mother's maiden name` },
  { question: 'Childhood best friend name' },
  { question: 'Favorite book' },
  { question: 'Favourite dish' },
  { question: 'Choose your favorite color' },
  { question: 'Write your question' },
];
