'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GradeIcon } from '@/components/common/grade-icon';
import { getMyProfile } from '@/data/mock-my-profile';
import { useAuthMock } from '@/stores/auth-mock-store';
import { LoginCtaDialog } from '@/components/features/auth/login-cta-dialog';

const NAV_TABS = [
  { label: '맛집 탐색', href: '/', requiresAuth: false },
  { label: '나의 맛집', href: '/my-places', requiresAuth: true },
] as const;

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const toggle = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="테마 토글"
      onClick={toggle}
    >
      {mounted && resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}

export function Header() {
  const pathname = usePathname();
  const profile = getMyProfile();
  const { isAuthed } = useAuthMock();
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
          <Link href="/" className="text-headline-2 text-primary tracking-tight">
            TrustBite
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-4 h-4" />
            </Button>

            {isAuthed ? (
              <Link
                href="/profile"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <span className="text-title-3 text-foreground">감자먹는 햄찌</span>
                <GradeIcon level={profile.level} size="xs" />
                <Avatar className="h-8 w-8 ml-0.5">
                  <AvatarImage src="" alt="프로필" />
                  <AvatarFallback className="bg-primary-subtle text-primary text-label-3">
                    햄
                  </AvatarFallback>
                </Avatar>
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
                    'px-4 pb-2.5 pt-1 text-sm transition-colors font-medium text-muted-foreground hover:text-foreground',
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
                  'px-4 pb-2.5 pt-1 text-sm transition-colors',
                  isActive
                    ? 'border-b-2 border-primary font-semibold text-primary'
                    : 'font-medium text-muted-foreground hover:text-foreground',
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
