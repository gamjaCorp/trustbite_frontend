import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { Provider } from 'next-auth/providers';
import { postGoogleSession, postRefreshToken } from './api/auth/auth';
import { AUTH_ERROR } from './lib/types/auth/error';

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

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers,
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7일
  },
  callbacks: {
    // 로그인, 세션 읽을때마다 호출
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update') {
        if (session?.needsOnboarding !== undefined) token.needsOnboarding = session.needsOnboarding;
        if (session?.user?.name !== undefined) token.name = session.user.name;
        return token;
      }

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
            const data = await postRefreshToken(token.refreshToken!);
            token.accessToken = data.accessToken;
            const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
            token.id = String(payload.sub);
            token.accessTokenExpires = payload.exp * 1000;
            token.error = undefined;
          } catch {
            token.error = AUTH_ERROR.REFRESH_TOKEN_EXPIRED;
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
          const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
          token.id = String(payload.sub);
          token.accessTokenExpires = payload.exp * 1000;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.name) session.user.name = token.name;
      session.needsOnboarding = token.needsOnboarding;
      session.error = token.error;

      return session;
    },
  },
});
