import { FileText, ShieldCheck } from 'lucide-react';

import { GradeIcon } from '@/components/common/trust/grade-icon';
import { MetricProgressBlock } from '@/components/core/metric-progress-block';
import { getNextLevelDef, getProgressToNext } from '@/lib/domain/grade-levels';
import type { GradeLevel } from '@/lib/domain/grade-levels';
import { cn } from '@/lib/utils';

interface Props {
  level: GradeLevel;
  reviewCount: number;
  trustScore: number;
}

// 다음 등급 패널 — 현재 등급에서 다음 등급까지 남은 조건 표시
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
        <MetricProgressBlock
          icon={FileText}
          iconClassName="text-palette-amber"
          label={`리뷰 ${next.reviewMin}개`}
          met={progress.reviewMet}
          remaining={`${reviewRemaining}개 남음`}
          progressValue={progress.reviewPct}
          progressClassName="bg-palette-amber/20 [&>[data-slot=progress-indicator]]:bg-palette-amber"
        />
        <MetricProgressBlock
          icon={ShieldCheck}
          iconClassName="text-palette-green"
          label={`신뢰도 ${next.trustMin}%`}
          met={progress.trustMet}
          remaining={`${trustRemaining}%P 남음`}
          progressValue={progress.trustPct}
          progressClassName="bg-palette-green/20 [&>[data-slot=progress-indicator]]:bg-palette-green"
        />
      </div>
    </div>
  );
}
