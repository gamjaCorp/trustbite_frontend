import { Award } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { GRADE_LABEL } from '@/lib/trust-score';
import type { Grade } from '@/types/restaurant';

interface Props {
  currentGrade: Grade;
  currentGradeReviewCount: number;
  currentGradeReviewTarget: number;
  nextGradeName: string;
  remainingReviewsForNextGrade: number;
}

export function GradeProgressCard({
  currentGrade,
  currentGradeReviewCount,
  currentGradeReviewTarget,
  nextGradeName,
  remainingReviewsForNextGrade,
}: Props) {
  const progressPct = Math.min(
    100,
    Math.round((currentGradeReviewCount / currentGradeReviewTarget) * 100),
  );

  return (
    <div className="border-t border-border/40 pt-4">
      <p className="text-label-2 text-muted-foreground mb-3">현재 등급</p>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-palette-amber shrink-0" />
          <span className="text-title-2 text-foreground">{GRADE_LABEL[currentGrade]}</span>
        </div>
        <span className="font-numeric text-label-2 text-muted-foreground">
          {currentGradeReviewCount}/{currentGradeReviewTarget}
        </span>
      </div>

      <Progress
        value={progressPct}
        className="h-2 bg-palette-amber/20 [&>[data-slot=progress-indicator]]:bg-palette-amber"
      />

      <p className="mt-2.5 text-caption-1 text-muted-foreground">
        <span className="font-semibold text-foreground">{nextGradeName}</span>까지 리뷰{' '}
        <span className="font-numeric font-semibold text-palette-amber">
          {remainingReviewsForNextGrade}
        </span>
        개 남았어요
      </p>
    </div>
  );
}
