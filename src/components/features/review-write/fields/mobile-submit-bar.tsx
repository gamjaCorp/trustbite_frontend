'use client';

import { cn } from '@/lib/utils';
import {
  useReviewIsEditMode,
  useReviewIsValid,
  useReviewTrustDelta,
} from '@/stores/review-write-store';

interface Props {
  onSubmit: () => void;
  baseTrustScore: number;
}

// 모바일 전용 하단 고정 제출 바 — lg 이상에서는 사이드바 CTA 사용
export function MobileSubmitBar({ onSubmit, baseTrustScore }: Props) {
  const isValid = useReviewIsValid();
  const delta = useReviewTrustDelta();
  const next = Math.min(100, baseTrustScore + delta);
  const isEditMode = useReviewIsEditMode();

  // 신뢰도 프리뷰(좌)와 CTA(우)를 한 행에 배치해 수직 공간을 절약
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <div className="flex flex-col">
          <span className="text-caption-2 text-muted-foreground">신뢰도</span>
          <span className="text-title-2 text-foreground">
            {baseTrustScore}% → <span className="text-primary">{next.toFixed(0)}%</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValid}
          className={cn(
            'ml-auto h-12 rounded-xl px-6 text-label-1 transition-colors',
            isValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]'
              : 'bg-muted text-muted-foreground cursor-not-allowed',
          )}
        >
          {isEditMode ? '리뷰 수정하기' : '리뷰 등록하기'}
        </button>
      </div>
    </div>
  );
}
