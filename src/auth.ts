import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { Provider } from 'next-auth/providers';

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
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
