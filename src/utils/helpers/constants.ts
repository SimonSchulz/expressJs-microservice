import { VerificationDto } from '../../security/dto/verificationDto';
import { MobilePhoneDto } from '../../registration/dto/mobilePhone.dto';
import UpdateUserProfileDto from '../../registration/dto/updateData.dto';
import { smsNotificationDto } from '../../user/settings/notifications/dto/notifications.dto';
import ChangeUserSettingsDto from '../../user/settings/dto/userSettings.dto';
import sendNotificationSettingsDto from '../../user/settings/notifications/dto/sendNotificationDto';

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
  '/auth/user/settings/notifications/all': sendNotificationSettingsDto,
  '/auth/user/settings/notifications/patch': smsNotificationDto,
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
