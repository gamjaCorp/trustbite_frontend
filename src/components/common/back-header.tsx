'use client';

// 뒤로가기 + TrustBite 로고 + 우측 내 프로필을 표시하는 페이지 헤더
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserGradeMark } from '@/components/common/user-grade-mark';
import { getMyProfile } from '@/data/mock-my-profile';
import { useAuthMock } from '@/stores/auth-mock-store';
import { useMyProfileMock } from '@/stores/my-profile-mock-store';

export function BackHeader() {
  const router = useRouter();
  const { isAuthed } = useAuthMock();
  const { nickname } = useMyProfileMock();
  const profile = getMyProfile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="relative max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-0.5 text-caption-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          이전으로
        </button>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-title-1 text-primary tracking-tight hover:opacity-80 transition-opacity"
        >
          TrustBite.
        </Link>

        {isAuthed ? (
          <Link
            href="/profile"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <span className="text-title-3 text-foreground">{nickname}</span>
            <UserGradeMark level={profile.level} size="sm" />
            <Avatar className="h-8 w-8 ml-0.5">
              <AvatarImage src="" alt="프로필" />
              <AvatarFallback className="bg-primary-subtle text-primary text-label-3">
                {nickname.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/signin">로그인</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
