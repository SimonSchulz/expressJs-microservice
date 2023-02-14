import { UpdateUserPasswordDto } from '../../login/dto/UpdateUserPassword.dto';
import { RegistrationInputDto } from '../../registration/dto/registration.input.dto';
import { MobilePhoneDto } from '../../registration/dto/mobilePhone.dto';
import { EmailDto } from '../../registration/dto/email.dto';
import { PassportIdDto } from '../../registration/dto/passportId.dto';
import { PasswordDto } from '../../registration/dto/password.dto';
import { RegistrationDataDto } from '../../registration/dto/registrationData.dto';
import UpdateUserProfileDto from '../../registration/dto/updateData.dto';
import { VerificationDto } from '../../security/dto/verificationDto';
import ChangeUserSettingsDto from '../../user/settings/dto/userSettings.dto';
import { smsNotificationDto } from '../../user/settings/notifications/dto/notifications.dto';
import sendNotificationSettingsDto from '../../user/settings/notifications/dto/sendNotificationDto';
import { LoginDataDto } from '../../login/dto/logindata.dto';
import { ChangePasswordDto } from '../../user/settings/dto/changePassword.dto';
import { ChangeSecurityQuestionDto } from '../../user/settings/dto/changeSecurityQuestion.dto';
import { ChangeContactsDto } from '../../user/settings/dto/changeContacts';

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
  INVALID_ANSWER_FORMAT = 'Invalid answer format',
}

export const Endpoints = {
  '/registration': RegistrationInputDto,
  '/registration/user-profile': UpdateUserProfileDto,
  '/registration/user-profile/new': RegistrationDataDto,
  '/auth/user/settings/all': ChangeUserSettingsDto,
  '/security/session': EmailDto,
  '/security/session/newpasswordotp': PassportIdDto,
  '/security/session/newpassword': PasswordDto,
  '/security/session/verification': VerificationDto,
  '/login': LoginDataDto,
  '/login/password': UpdateUserPasswordDto,
  '/auth/user/settings/notifications/all': sendNotificationSettingsDto,
  '/auth/user/settings/notifications': smsNotificationDto,
  '/auth/user/settings/contacts': ChangeContactsDto,
  '/auth/user/settings/password': ChangePasswordDto,
  '/auth/user/settings/security-question': ChangeSecurityQuestionDto,
};

export const SecurityQuestions = [
  { question: `Mother's maiden name` },
  { question: 'Childhood best friend name' },
  { question: 'Favorite book' },
  { question: 'Favourite dish' },
  { question: 'Choose your favorite color' },
];

export enum loginTypes {
  email = 'email',
  passportId = 'passportId',
}

export enum emailService {
  subject = 'Your one time code',
  text = 'Hello!, your one time code is ',
}
