const CODE_EXPIRATION_TIME = 15;

// eslint-disable-next-line no-shadow
enum ClientStatus {
  ACTIVE = 'active',
  NOT_ACTIVE = 'notActive',
  NOT_REGISTER = 'notRegister',
  CLOSED = 'closed',
  NOT_CLIENT = 'notClient',
}

export default ClientStatus;
