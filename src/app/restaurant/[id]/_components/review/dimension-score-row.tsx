// 리뷰 차원 점수 인라인 표시 — 맛/가성비/분위기 레이블+점수 행
import { cn } from '@/lib/utils';
import type { RatingScores } from '@/types/restaurant';
import { SCORE_LABELS } from '@/lib/domain/score-labels';

interface Props {
  scores: RatingScores;
  className?: string;
}

export function DimensionScoreRow({ scores, className }: Props) {
  return (
    <div className={cn('flex items-center gap-3 text-body-2 text-muted-foreground', className)}>
      {SCORE_LABELS.map(({ key, label }) => (
        <span key={key}>
          {label}{' '}
          <span className="text-title-2 text-foreground tabular-nums">{scores[key].toFixed(1)}</span>
        </span>
      ))}
    </div>
  );
}
