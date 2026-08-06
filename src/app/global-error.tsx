'use client';

import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import { ErrorView } from '@/components/common/layout/error-view';

// 루트 레이아웃 자체가 죽었을 때의 최후 경계 — 레이아웃을 대체하므로 html·body·CSS를 직접 선언한다
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <main className="flex min-h-screen items-center justify-center bg-background">
          <ErrorView reset={reset} />
        </main>
      </body>
    </html>
  );
}
