import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { Provider } from 'next-auth/providers';
import { postGoogleSession, postRefreshToken } from './api/auth/auth';

const providers: Provider[] = [Google];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30일 (NextAuth 기본값을 명시적으로 고정)
  },
  callbacks: {
    // 로그인, 세션 읽을때마다 호출
    async jwt({ token, user, account }) {
      if (user) token.id = user.id;
      // 로그인 된 상태
      if (!account) {
        if (token?.accessTokenExpires && Date.now() < token.accessTokenExpires) {
          return token;
        } else {
          if (!token?.accessTokenExpires) {
            return token;
          }

          // 토큰 갱신 필요
          try {
            const res = await postRefreshToken(token.refreshToken!);
            token.accessToken = res.accessToken;
            token.refreshToken = res.refreshToken;
            token.accessTokenExpires = JSON.parse(atob(res.accessToken.split('.')[1])).exp * 1000;
            token.error = undefined;
          } catch {
            token.error = 'RefreshTokenExpired';
          }
        }
      }
      // 로그인 안된 상태
      else {
        const idToken = account?.id_token;
        if (!idToken) return token;

        const data = await postGoogleSession(idToken);

        if (data?.accessToken) {
          token.accessToken = data.accessToken;
          token.refreshToken = data.refreshToken;
          token.needsOnboarding = data.needsOnboarding;
          token.accessTokenExpires = JSON.parse(atob(data.accessToken.split('.')[1])).exp * 1000;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      session.needsOnboarding = token.needsOnboarding;
      return session;
    },
  },
});
