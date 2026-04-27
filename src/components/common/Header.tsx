'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_TABS = [
  { label: '맛집 탐색', href: '/' },
  { label: '나의 맛집', href: '/my' },
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

  // 맛집 상세·사용자 프로필은 자체 헤더를 따로 렌더링한다.
  if (pathname.startsWith('/restaurant/') || pathname.startsWith('/user/')) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold text-primary tracking-tight">
          TrustBite
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-4 h-4" />
          </Button>

          <Link
            href="/me"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <span className="text-sm font-medium text-foreground">감자먹는 햄찌</span>
            <Badge className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              🏆
            </Badge>
            <Avatar className="h-8 w-8 ml-0.5">
              <AvatarImage src="" alt="프로필" />
              <AvatarFallback className="bg-primary-subtle text-primary text-xs font-bold">
                햄
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      <nav className="max-w-5xl mx-auto w-full flex px-6">
        {NAV_TABS.map((tab) => {
          const isActive =
            tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);

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
  );
}
