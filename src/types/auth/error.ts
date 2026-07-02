export const AUTH_ERROR = {
  REFRESH_TOKEN_EXPIRED: 'RefreshTokenExpired',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR];
