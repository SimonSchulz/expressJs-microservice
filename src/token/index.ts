export interface Token {
    userId: UserID;
    exp: TokenTimestamp;
    iat: TokenTimestamp;
  }
export type SignedToken = `${string}.${string}.${string}`
export type UserID = number; // TODO: unify with api-gateway version which uses string here
export type Timestamp = number; // milliseconds since the unix epoch
export type TokenTimestamp = number; // seconds (not ms) since the unix epoch, as per jwt spec
