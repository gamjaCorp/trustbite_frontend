'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { formatDelta } from '@/lib/format';
import { Progress } from '@/components/ui/progress';
import type { TrustBreakdown } from '@/stores/review-write-store';

interface Props {
  baseTrustScore: number;
  nextTrustScore: number;
  breakdown: TrustBreakdown;
}

export function TrustScoreChangeCard({ baseTrustScore, nextTrustScore, breakdown }: Props) {
  const [displayScore, setDisplayScore] = useState(baseTrustScore);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressValue(nextTrustScore);

      const start = baseTrustScore;
      const end = nextTrustScore;
      const duration = 800;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayScore(Math.round(start + (end - start) * eased));
        if (t < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, 200);

    return () => clearTimeout(timeout);
  }, [baseTrustScore, nextTrustScore]);

  return (
    <div className="rounded-2xl bg-success-subtle p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-label-2 text-muted-foreground">내 신뢰도</span>
        <span className="inline-flex items-center rounded-chip bg-success text-background px-2.5 py-0.5 text-label-3">
          +<span className="">{formatDelta(breakdown.total)}</span>%P
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-label-1 text-muted-foreground line-through">
          {baseTrustScore}%
        </span>
        <span className={cn('text-display-1 text-success')}>
          {displayScore}
          <span className="text-headline-1">%</span>
        </span>
      </div>

      <Progress
        value={progressValue}
        className="mt-3 h-2.5 bg-success/20 [&>[data-slot=progress-indicator]]:bg-success transition-all duration-700"
      />
    </div>
  );
}
