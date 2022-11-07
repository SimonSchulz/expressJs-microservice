import { UpdateUserPasswordDto } from '../../login/dto/UpdateUserPassword.dto';
import { MobilePhoneDto } from '../../registration/dto/mobilePhone.dto';
import { EmailDto } from '../../registration/dto/email.dto';
import { RegistrationDataDto } from '../../registration/dto/registrationData.dto';
import UpdateUserProfileDto from '../../registration/dto/updateData.dto';
import { VerificationDto } from '../../security/dto/verificationDto';
import SendUserDataDto from '../../user/information/dto/getUserInformation.dto';
import ChangeUserSettingsDto from '../../user/settings/dto/userSettings.dto';
import { smsNotificationDto } from '../../user/settings/notifications/dto/notifications.dto';
import sendNotificationSettingsDto from '../../user/settings/notifications/dto/sendNotificationDto';

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
  ERROR = 'Error',
  IS_CLIENT = 'isClient',
  INVALID_QUESTION_FORMAT = 'Invalid Question format',
  NOT_VERIFIED = 'User not verified',
  SAME_PASS = 'Received same password',
}

export const Endpoints = {
  '/registration': MobilePhoneDto,
  '/registration/user-profile': UpdateUserProfileDto,
  '/registration/user-profile/new': RegistrationDataDto,
  '/registration/check-email': EmailDto,
  '/auth/user/settings/all': ChangeUserSettingsDto,
  '/security/session': MobilePhoneDto,
  '/security/session/verification': VerificationDto,
  '/login/password': UpdateUserPasswordDto,
  '/auth/information': SendUserDataDto,
  '/auth/user/settings/notifications/all': sendNotificationSettingsDto,
  '/auth/user/settings/notifications': smsNotificationDto,
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
