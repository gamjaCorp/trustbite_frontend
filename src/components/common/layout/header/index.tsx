import Link from 'next/link';
import { UserAuthButton } from './user-auth-button';
import { NavTabs } from './nav-tabs';
import { getSession } from '@/auth';
import { getMyProfile } from '@/api/user/user';

// 글로벌 헤더 — 탭 내비게이션과 로그인/아바타 영역. app/(main) 그룹 레이아웃이 렌더한다
export async function Header() {
  const session = await getSession();

  let me = null;
  if (session && !session.needsOnboarding) {
    me = await getMyProfile().catch(() => null);
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-23 w-full border-b border-border bg-background">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between px-6 py-3">
          <Link href="/" className="text-headline-2 text-primary tracking-tight">
            TrustBite
          </Link>
          <UserAuthButton me={me} />
        </div>

        <NavTabs isAuthed={!!me} />
      </header>
    </>
  );
}
