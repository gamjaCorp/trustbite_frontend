'use client';

// 뒤로가기 + TrustBite 로고 + 우측 내 프로필을 표시하는 페이지 헤더
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import type { MyProfileResponse } from '@/types/user';
import { UserAuthButton } from './header/user-auth-button';

interface Props {
  me: MyProfileResponse | null; // 서버 레이아웃이 조회한 내 프로필. 비로그인·조회 실패 시 null
  fallbackHref?: string; // 돌아갈 히스토리가 없을 때 이동할 경로
}

// 뒤로가기 헤더 — 상세·폼 페이지 상단 고정 헤더 (뒤로가기 + 사용자 정보)
export function BackHeader({ me, fallbackHref = '/' }: Props) {
  const router = useRouter();

  // 딥링크·새 탭·OAuth 리다이렉트 직후엔 돌아갈 히스토리가 없어 back()이 아무 일도 하지 않는다
  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-border bg-background">
      <div className="relative max-w-5xl mx-auto h-full flex items-center justify-between px-6">
        <button
          type="button"
          onClick={handleBack}
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

        <UserAuthButton me={me} />
      </div>
    </header>
  );
}
