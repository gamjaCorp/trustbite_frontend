export interface GoogleSessionResponse {
  accessToken: string;
  refreshToken: string;
  needsOnboarding: boolean;
}

export interface TokenRefreshResponse {
  accessToken: string;
}
