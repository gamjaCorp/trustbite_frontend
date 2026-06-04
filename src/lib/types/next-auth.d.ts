import { type DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user'];
    accessToken?: string; // W4에서 jwt 콜백이 채운다. 골격 단계에선 undefined.
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    accessToken?: string; // 백엔드 Bearer 토큰 — W4에서 POST /auth/login 후 저장
  }
}
