import { type DefaultSession } from 'next-auth';
import 'next-auth/jwt';
import { AuthErrorCode } from './auth/error';

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user'];
    needsOnboarding?: boolean;
    error?: AuthErrorCode;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    needsOnboarding?: boolean;
    accessTokenExpires?: number;
    error?: AuthErrorCode;
  }
}
