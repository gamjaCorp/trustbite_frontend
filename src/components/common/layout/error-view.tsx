'use client';

import Link from 'next/link';
import { TriangleAlert, RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/core/empty-state';

interface Props {
  reset: () => void; // 에러 경계가 넘겨주는 재시도 함수 — 경계 하위를 다시 렌더한다
}

// 런타임 에러 본문 — 라우트별 error.tsx 4개가 같은 문구를 쓰도록 한 곳에 모은다
export function ErrorView({ reset }: Props) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title="문제가 발생했어요"
      description="잠시 후 다시 시도해 주세요. 계속 반복되면 새로고침해 주세요."
      cta={
        <div className="flex items-center gap-2">
          <Button type="button" size="lg" onClick={reset}>
            <RotateCw />
            다시 시도
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      }
    />
  );
}
