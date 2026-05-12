import { Check, FileText, ShieldCheck } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { GradeIcon } from '@/components/core/grade-icon';
import { getNextLevelDef, getProgressToNext } from '@/lib/grade-levels';
import type { GradeLevel } from '@/lib/grade-levels';
import { cn } from '@/lib/utils';

interface Props {
  level: GradeLevel;
  reviewCount: number;
  trustScore: number;
}

export function NextStagePanel({ level, reviewCount, trustScore }: Props) {
  const next = getNextLevelDef(level);
  const progress = getProgressToNext(level, reviewCount, trustScore);

  if (!next || !progress) {
    return (
      <div className="p-5 flex items-center justify-center">
        <p className="text-title-2 text-foreground">최고 등급입니다 🎉</p>
      </div>
    );
  }

  const conditionLabel = next.condition === 'OR' ? '둘 중 하나만 달성' : '둘 다 달성';

  const reviewRemaining = Math.max(0, next.reviewMin - reviewCount);
  const trustRemaining = Math.max(0, next.trustMin - trustScore);

  return (
    <div className="px-8 py-6 space-y-8">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-label-2 text-muted-foreground">다음 단계</p>
          <p className="text-title-2 text-foreground mt-1">
            <span className={cn('inline-flex items-center gap-1 align-middle', next.toneClass.text, 'font-semibold')}>
              <GradeIcon level={next.level} size="sm" variant="inline" />
              {next.label}
            </span>
            까지
          </p>
        </div>
        <span className="shrink-0 rounded-chip bg-primary/10 text-primary px-2 py-1 text-label-3">
          {conditionLabel}
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-palette-amber shrink-0" />
              <span className="text-label-2 text-foreground">리뷰 {next.reviewMin}개</span>
            </div>
            {progress.reviewMet ? (
              <Check className="w-4 h-4 text-success" strokeWidth={2.5} />
            ) : (
              <span className="font-numeric text-label-3 text-muted-foreground">
                {reviewRemaining}개 남음
              </span>
            )}
          </div>
          <Progress
            value={progress.reviewPct}
            className="h-3 bg-palette-amber/20 [&>[data-slot=progress-indicator]]:bg-palette-amber"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-palette-green shrink-0" />
              <span className="text-label-2 text-foreground">신뢰도 {next.trustMin}%</span>
            </div>
            {progress.trustMet ? (
              <Check className="w-4 h-4 text-success" strokeWidth={2.5} />
            ) : (
              <span className="font-numeric text-label-3 text-muted-foreground">
                {trustRemaining}%P 남음
              </span>
            )}
          </div>
          <Progress
            value={progress.trustPct}
            className="h-3 bg-palette-green/20 [&>[data-slot=progress-indicator]]:bg-palette-green"
          />
        </div>
      </div>
    </div>
  );
}
