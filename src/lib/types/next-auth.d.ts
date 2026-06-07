import { type DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user'];
    needsOnboarding?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    needsOnboarding?: boolean;
    accessTokenExpires?: number;
    error?: string; // 갱신 실패 시 'RefreshTokenExpired'
  }
}
