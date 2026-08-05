import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

import { GradeIcon } from '@/components/common/trust/grade-icon';
import { nameTolocalGrade } from '@/lib/domain/grade-levels';

interface Props {
  grade: string; // 현재 등급 enum 이름
  currentGradeReviewCount: number;
  currentGradeReviewTarget: number;
  nextGrade: string; // 다음 등급 enum 이름
  remainingReviewsForNextGrade: number;
}

// 등급 진행 카드 — 현재 등급과 다음 등급까지 남은 리뷰 수 시각화
export function GradeProgressCard({
  grade,
  currentGradeReviewCount,
  currentGradeReviewTarget,
  nextGrade,
  remainingReviewsForNextGrade,
}: Props) {
  const gradeDef = nameTolocalGrade(grade);
  const nextGradeDef = nameTolocalGrade(nextGrade);
  const progressPct = Math.min(
    100,
    Math.round((currentGradeReviewCount / currentGradeReviewTarget) * 100),
  );

  return (
    <Link href="/profile" className="block border-t border-border pt-4 hover:opacity-80 transition-opacity">
      <div className="flex items-center justify-between mb-3">
        <p className="text-label-2 text-muted-foreground">현재 등급</p>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          {gradeDef ? (
            <>
              <GradeIcon name={grade} size="sm" variant="inline" />
              <span className="text-title-2 text-foreground">{gradeDef.label}</span>
            </>
          ) : (
            <span className="text-title-2 text-foreground">{grade}</span>
          )}
        </div>
        <span className="text-label-2 text-muted-foreground">
          {currentGradeReviewCount}/{currentGradeReviewTarget}
        </span>
      </div>

      <Progress
        value={progressPct}
        className="h-2 bg-palette-amber/20 [&>[data-slot=progress-indicator]]:bg-palette-amber"
      />

      <p className="mt-2.5 text-caption-1 text-muted-foreground">
        {nextGradeDef ? (
          <span className={cn('inline-flex items-center gap-1 align-middle font-semibold', nextGradeDef.toneClass.text)}>
            <GradeIcon name={nextGrade} size="sm" variant="inline" />
            {nextGradeDef.label}
          </span>
        ) : (
          <span className="font-semibold text-foreground">{nextGrade}</span>
        )}
        까지 리뷰{' '}
        <span className="font-semibold text-palette-amber">
          {remainingReviewsForNextGrade}
        </span>
        개 남았어요
      </p>
    </Link>
  );
}
