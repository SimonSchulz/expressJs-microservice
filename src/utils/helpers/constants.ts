import { VerificationDto } from '../../security/dto/verificationDto';
import { MobilePhoneDto } from '../../registration/dto/mobilePhone.dto';
import UpdateUserProfileDto from '../../registration/dto/updateData.dto';
import { smsNotificationDto } from '../../user/settings/notifications/dto/notifications.dto';

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
  '/security/session': MobilePhoneDto,
  '/security/session/verification': VerificationDto,
  '/auth/user/settings/notifications/sms': smsNotificationDto,
};
export const SecurityQuestions = [
  { question: `Mother's maiden name` },
  { question: 'Childhood best friend name' },
  { question: 'Favorite book' },
  { question: 'Favourite dish' },
  { question: 'Choose your favorite color' },
  { question: 'Write your question' },
];
