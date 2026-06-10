import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import { UserAuthButton } from './user-auth-button';
import { NavTabs } from './nav-tabs';
import { auth } from '@/auth';
import { getMyProfile } from '@/api/user/user';

// 글로벌 헤더 — 하단 탭 내비게이션과 로그인/아바타 영역
export async function Header() {
  //   const pathname = usePathname();
  const session = await auth();

  let me = null;
  if (session && !session.needsOnboarding) {
    me = await getMyProfile().catch(() => null);
  }

  // 맛집 상세·사용자 프로필은 자체 헤더를 따로 렌더링한다.
  //   if (pathname.startsWith('/restaurant/') || pathname.startsWith('/user/')) return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
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
