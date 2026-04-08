'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 탭 목록 정의
const NAV_TABS = [
  { label: '나의 맛집', href: '/' },
  { label: '지역 랭킹', href: '/ranking' },
  { label: '맛집 지도', href: '/map' },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      {/* 1단: 로고 + 유저 영역 */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between px-6 py-3">
        {/* 로고 */}
        <Link href="/" className="text-xl font-bold text-primary tracking-tight">
          TrustBite
        </Link>

        {/* 유저 영역 */}
        <div className="flex items-center gap-2">
          {/* 알림 버튼 */}
          <Button variant="ghost" size="icon" className="rounded-full text-lg">
            🔔
          </Button>

          {/* 닉네임 + 등급 */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground">감자먹는 햄찌</span>
            <Badge className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
              🏆
            </Badge>
          </div>

          {/* 프로필 사진 */}
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="프로필" />
            <AvatarFallback className="bg-primary-subtle text-primary text-xs font-bold">
              햄
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* 2단: 탭 네비게이션 */}
      <nav className="max-w-5xl mx-auto w-full flex px-6">
        {NAV_TABS.map((tab) => {
          // 홈 탭은 정확히 '/'일 때만 활성, 나머지는 startsWith로 판단
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
