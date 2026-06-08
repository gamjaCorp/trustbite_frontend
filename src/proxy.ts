import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (session?.needsOnboarding && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }
  if (session && !session?.needsOnboarding && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

//모든 경로 중 api / _next/static / _next/image / favicon.ico / 제외
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|signin).*)'],
};
