'use client';

import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { getTrustToneClass } from '@/lib/trust-score';
import {
  LONG_TEXT_THRESHOLD,
  useReviewIsValid,
  useReviewPhotoCount,
  useReviewTextLength,
  useReviewTrustDelta,
} from '@/stores/review-write-store';

interface Props {
  baseScore: number;
  remainingReviewsForNextGrade: number;
  nextGradeName: string;
  onSubmit: () => void;
}

export function TrustDeltaCard({
  baseScore,
  remainingReviewsForNextGrade,
  nextGradeName,
  onSubmit,
}: Props) {
  const delta = useReviewTrustDelta();
  const isValid = useReviewIsValid();
  const photoCount = useReviewPhotoCount();
  const textLength = useReviewTextLength();

  const next = Math.min(100, baseScore + delta);
  const tone = getTrustToneClass(next);

  const reachedLongText = textLength >= LONG_TEXT_THRESHOLD;
  const hasPhoto = photoCount > 0;

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border p-4 shadow-card">
      <header className="flex items-center justify-between">
        <h3 className="text-title-2 text-foreground">내 신뢰도</h3>
        <span className={cn('inline-flex items-center gap-0.5 text-label-3', tone.text)}>
          +<span className="">{delta.toFixed(1)}</span>%
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

      <div className="mt-4">
        <p className="text-caption-2 text-muted-foreground mb-2">획득 예정</p>
        <div className="flex flex-wrap gap-1.5">
          <PointChip label="리뷰" points={5} active={isValid} />
          <PointChip label="사진" points={3} active={hasPhoto} />
          {reachedLongText && <PointChip label="100자" points={2} active />}
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!isValid}
        className={cn(
          'mt-4 hidden w-full rounded-xl py-3.5 text-label-1 transition-colors lg:block',
          isValid
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]'
            : 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      >
        리뷰 등록하기
      </button>

      <p className="mt-2 hidden text-center text-caption-2 text-muted-foreground lg:block">
        {nextGradeName}까지 리뷰{' '}
        <span className="font-semibold text-foreground">
          {remainingReviewsForNextGrade}
        </span>
        개 남음
      </p>
    </div>
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
      +<span className="">{points}</span> P {label}
    </span>
  );
}
