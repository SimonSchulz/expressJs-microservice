import { VerificationDto } from '../../security/dto/verificationDto';
import { MobilePhoneDto } from '../../registration/dto/mobilePhone.dto';
import UpdateUserProfileDto from '../../registration/dto/updateData.dto';
import ChangeUserSettingsDto from '../../user/settings/dto/userSettings.dto';
import SendUserDataDto from '../../user/information/dto/getUserInformation.dto';

const CODE_EXPIRATION_TIME = 15;

// eslint-disable-next-line no-shadow

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
  '/auth/user/settings/all': ChangeUserSettingsDto,
  '/security/session': MobilePhoneDto,
  '/security/session/verification': VerificationDto,
  '/auth/information': SendUserDataDto,
};
export const SecurityQuestions = [
  { question: `Mother's maiden name` },
  { question: 'Childhood best friend name' },
  { question: 'Favorite book' },
  { question: 'Favourite dish' },
  { question: 'Choose your favorite color' },
  { question: 'Write your question' },
];

export enum loginTypes {
  mobilePhone = 'MOBILE_PHONE',
  passport = 'PASSPORT_NUMBER',
}
