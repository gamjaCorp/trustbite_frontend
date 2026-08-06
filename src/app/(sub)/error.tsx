'use client';

import { ErrorView } from '@/components/common/layout/error-view';

// (sub) 그룹 페이지 에러 — 레이아웃이 BackHeader와 <main>을 이미 주므로 정렬만 맡는다
export default function SubError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] items-center justify-center">
      <ErrorView reset={reset} />
    </div>
  );
}
