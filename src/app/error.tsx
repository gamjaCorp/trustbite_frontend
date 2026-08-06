'use client';

import { ErrorView } from '@/components/common/layout/error-view';

// 그룹 레이아웃까지 날아간 에러 — 루트 레이아웃엔 헤더도 <main>도 없어 여기서 직접 준다
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <ErrorView reset={reset} />
    </main>
  );
}
