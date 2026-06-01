'use client';

import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Surface } from '@/components/common/surface';
import { getTrustToneClass } from '@/lib/domain/trust-score';
import {
  useReviewIsEditMode,
  useReviewIsValid,
  useReviewTrustDelta,
} from '@/stores/review-write-store';

interface Props {
  baseScore: number;
  remainingReviewsForNextGrade: number;
  nextGradeName: string;
  onSubmit: () => void;
}

// 리뷰 제출 전 신뢰도 변동 미리보기 카드
export function TrustDeltaCard({
  baseScore,
  remainingReviewsForNextGrade,
  nextGradeName,
  onSubmit,
}: Props) {
  const delta = useReviewTrustDelta();
  const isValid = useReviewIsValid();
  const isEditMode = useReviewIsEditMode();

  const next = Math.min(100, baseScore + delta);
  const tone = getTrustToneClass(next);

  return (
    <Surface variant="card" padding="md">
      <header className="flex items-center justify-between">
        <h3 className="text-title-2 text-foreground">내 신뢰도</h3>
        <span className={cn('inline-flex items-center gap-0.5 text-label-3', tone.text)}>
          +{delta.toFixed(1)}%
          <ArrowUp className="w-3.5 h-3.5" />
        </span>
      </header>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-headline-1 text-muted-foreground">
          {baseScore}%
        </span>
        <span className="text-muted-foreground">→</span>
        <span className={cn('text-display-1', tone.text)}>
          {next.toFixed(0)}%
        </span>
      </div>

      <Progress value={next} className={cn('mt-3 h-2', tone.bg)} />

      {/* TODO: 1차 MVP 제외 — 포인트 적립 칩 (포인트 시스템 3차 MVP) */}
      <div aria-disabled="true" className="mt-4 opacity-35 cursor-not-allowed">
        <p className="text-caption-2 text-muted-foreground mb-2">포인트 시스템 준비 중</p>
        <div className="flex flex-wrap gap-1.5">
          <PointChip label="리뷰" points={5} active={false} />
          <PointChip label="사진" points={3} active={false} />
          <PointChip label="100자" points={2} active={false} />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!isValid}
        className={cn(
          'mt-4 hidden h-12 w-full rounded-xl text-label-1 transition-colors lg:block',
          isValid
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]'
            : 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      >
        {isEditMode ? '리뷰 수정하기' : '리뷰 등록하기'}
      </button>

        <p className="mt-2 hidden text-center text-caption-2 text-muted-foreground lg:block">
        {nextGradeName}까지 리뷰{' '}
        <span className="font-semibold text-foreground">
          {remainingReviewsForNextGrade}
        </span>
        개 남음
      </p>
    </Surface>
  );
}

function PointChip({
  label,
  points,
  active,
}: {
  label: string;
  points: number;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-chip px-2.5 py-1 text-label-3 transition-colors',
        active
          ? 'bg-success-subtle text-success ring-1 ring-success/30'
          : 'bg-muted text-muted-foreground',
      )}
    >
      +{points} P {label}
    </span>
  );
}
