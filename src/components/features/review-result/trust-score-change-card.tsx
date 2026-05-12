'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { TrustBreakdown } from '@/stores/review-write-store';

interface Props {
  baseTrustScore: number;
  nextTrustScore: number;
  breakdown: TrustBreakdown;
}

function formatDelta(value: number): string {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
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
    <div className="rounded-2xl bg-success/8 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-label-2 text-muted-foreground">내 신뢰도</span>
        <span className="inline-flex items-center rounded-chip bg-success text-white px-2.5 py-0.5 text-label-3">
          +<span className="font-numeric">{formatDelta(breakdown.total)}</span>%P
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-numeric text-label-1 text-muted-foreground line-through">
          {baseTrustScore}%
        </span>
        <span className={cn('font-numeric text-4xl font-bold text-success')}>
          {displayScore}
          <span className="text-2xl">%</span>
        </span>
      </div>

      <Progress
        value={progressValue}
        className="mt-3 h-2.5 bg-success/20 [&>[data-slot=progress-indicator]]:bg-success transition-all duration-700"
      />
    </div>
  );
}
