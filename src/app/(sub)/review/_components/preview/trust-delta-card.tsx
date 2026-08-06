'use client';

import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDelta } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Surface } from '@/components/common/display/surface';
import { GradeIcon } from '@/components/common/trust/grade-icon';
import { getTrustToneClass } from '@/lib/domain/trust-score';
import { nameTolocalGrade } from '@/lib/domain/grade-levels';
import {
  useReviewIsEditMode,
  useReviewIsValid,
  useReviewTrustDelta,
} from '../../_lib/review-write-store';
import { computeNextTrustScore } from '@/lib/domain/trust-delta';

interface Props {
  baseScore: number;
  remainingReviewsForNextGrade: number;
  nextGrade: string; // 다음 등급 enum 이름 — GradeIcon·라벨 매칭에 사용
  onSubmit: () => void;
}

// 리뷰 제출 전 신뢰도 변동 미리보기 카드
export function TrustDeltaCard({
  baseScore,
  remainingReviewsForNextGrade,
  nextGrade,
  onSubmit,
}: Props) {
  const nextGradeDef = nameTolocalGrade(nextGrade);
  const delta = useReviewTrustDelta();
  const isValid = useReviewIsValid();
  const isEditMode = useReviewIsEditMode();

  const next = computeNextTrustScore(baseScore, delta);
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
        <span className="text-headline-1 text-muted-foreground">{baseScore}%</span>
        <span className="text-muted-foreground">→</span>
        <span className={cn('text-display-1', tone.text)}>{formatDelta(next)}%</span>
      </div>

      <Progress value={next} className={cn('mt-3 h-2', tone.bg)} />
      {/* TODO: 1차 MVP 제외 — 포인트 적립 칩 (포인트 시스템 3차 MVP) */}

      <Button
        type="button"
        onClick={onSubmit}
        disabled={!isValid}
        className={cn(
          'mt-4 hidden h-12 w-full rounded-xl text-label-1 transition-colors disabled:opacity-100 lg:block',
          isValid
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]'
            : 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      >
        {isEditMode ? '리뷰 수정하기' : '리뷰 등록하기'}
      </Button>

      <p className="mt-2 hidden text-center text-caption-2 text-muted-foreground lg:block">
        {nextGradeDef ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 align-middle font-semibold',
              nextGradeDef.toneClass.text,
            )}
          >
            <GradeIcon name={nextGrade} size="sm" variant="inline" />
            {nextGradeDef.label}
          </span>
        ) : (
          nextGrade
        )}
        까지 리뷰{' '}
        <span className="font-semibold text-foreground">{remainingReviewsForNextGrade}</span>개 남음
      </p>
    </Surface>
  );
}
