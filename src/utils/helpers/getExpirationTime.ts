export default function getExpirationTime(userBlockExpiration: number): Date {
  const MS_IN_SEC = 1000;

  return new Date(Date.now() + userBlockExpiration * MS_IN_SEC);
}
