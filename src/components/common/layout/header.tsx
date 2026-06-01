'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserGradeMark } from '@/components/common/user-grade-mark';
import { getMyProfile } from '@/data/mock-my-profile';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { LoginCtaDialog } from '@/components/common/login-cta-dialog';

const NAV_TABS = [
  { label: '맛집 탐색', href: '/', requiresAuth: false },
  { label: '나의 맛집', href: '/my-places', requiresAuth: true },
] as const;

export function Header() {
  const pathname = usePathname();
  const profile = getMyProfile();
  const { isAuthed, user } = useAuthStatus();
  const [myPlacesDialogOpen, setMyPlacesDialogOpen] = useState(false);

  // 맛집 상세·사용자 프로필은 자체 헤더를 따로 렌더링한다. 로그인/온보딩은 미니 랜딩.
  if (
    pathname.startsWith('/restaurant/') ||
    pathname.startsWith('/user/') ||
    pathname === '/onboarding'
  )
    return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between px-6 py-3">
          <Link
            href="/"
            onClick={(e) => {
              // 이미 홈이면 soft-nav가 no-op이라 검색 상태가 남음 → 풀 리로드로 초기화
              if (pathname === '/') {
                e.preventDefault();
                window.location.assign('/');
              }
            }}
            className="text-headline-2 text-primary tracking-tight"
          >
            TrustBite
          </Link>

          <div className="flex items-center gap-2">
            {isAuthed ? (
              <Link
                href="/profile"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image ?? ''} alt="프로필" />
                  <AvatarFallback className="bg-primary-subtle text-primary text-label-3">
                    {user?.name?.slice(0, 1) ?? '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-title-3 text-foreground">{user?.name}</span>
                <UserGradeMark level={profile.level} size="sm" />
              </Link>
            ) : (
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link href="/signin">로그인</Link>
              </Button>
            )}
          </div>
        </div>

        <nav className="max-w-5xl mx-auto w-full flex px-6">
          {NAV_TABS.map((tab) => {
            const isActive =
              tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);

            if (tab.requiresAuth && !isAuthed) {
              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => setMyPlacesDialogOpen(true)}
                  className={cn(
                    'px-4 pb-2.5 pt-1 text-title-3 transition-colors text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'px-4 pb-2.5 pt-1 transition-colors',
                  isActive
                    ? 'border-b-2 border-primary text-title-2 text-primary'
                    : 'text-body-2 text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <LoginCtaDialog
        open={myPlacesDialogOpen}
        onOpenChange={setMyPlacesDialogOpen}
        callbackPath="/my-places"
        description="로그인하면 나만의 맛집 지도를 만들 수 있어요"
      />
    </>
  );
}
