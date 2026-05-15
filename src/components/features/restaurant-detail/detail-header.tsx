'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthMock } from '@/stores/auth-mock-store';

// 식당 상세 페이지 전용 헤더 (비로그인 시 우측 본인 정보 → 로그인 버튼)
export function DetailHeader() {
  const { isAuthed } = useAuthMock();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="relative max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          탐색으로
        </Link>

        <span className="absolute left-1/2 -translate-x-1/2 text-title-1 text-primary tracking-tight">
          TrustBite.
        </span>

        {isAuthed ? (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end leading-tight">
              <span className="rounded-chip bg-muted px-2 py-0.5 text-label-3 text-foreground">
                Lv.3
              </span>
              <span className="text-caption-2 text-muted-foreground mt-0.5">신뢰도 72%</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-subtle text-primary text-label-3">
                민
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/signin">로그인</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
