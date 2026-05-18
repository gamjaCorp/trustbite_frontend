'use client';

import { cn } from '@/lib/utils';
import { useReviewAvgScore, useSelectedRestaurant } from '@/stores/review-write-store';
import type { RegionalRankEntry } from '@/types/restaurant';

interface Props {
  myTopRestaurants: RegionalRankEntry[];
}

interface PreviewRow {
  isNew: boolean;
  name: string;
  avgScore: number;
}

const VISIBLE_COUNT = 5;

export function RankingPreview({ myTopRestaurants }: Props) {
  const avgScore = useReviewAvgScore();
  const selected = useSelectedRestaurant();
  const targetName = selected?.name ?? '';

  const baseRows: PreviewRow[] = myTopRestaurants
    .slice(0, VISIBLE_COUNT)
    .map((r) => ({ isNew: false, name: r.name, avgScore: r.avgScore }));

  const rows: PreviewRow[] =
    avgScore > 0
      ? [...baseRows, { isNew: true, name: targetName, avgScore }]
          .sort((a, b) => {
            if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
            if (a.isNew) return -1;
            if (b.isNew) return 1;
            return 0;
          })
          .slice(0, VISIBLE_COUNT)
      : baseRows;

  return (
    <div className="rounded-2xl bg-card ring-1 ring-paper-edge/40 p-4 shadow-card">
      <header className="mb-3">
        <h3 className="text-title-2 text-foreground">내 랭킹 미리보기</h3>
        <p className="text-caption-2 text-muted-foreground mt-0.5">
          별점 입력하면 위치가 바뀌어요
        </p>
      </header>

      <ol className="space-y-1">
        {rows.map((row, idx) => {
          const rank = idx + 1;
          return (
            <li
              key={`${row.name}-${row.isNew ? 'new' : rank}`}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 transition-colors',
                row.isNew && 'bg-primary/5 ring-1 ring-primary/30',
              )}
            >
              <span
                className={cn(
                  'w-5 text-center text-title-2 shrink-0',
                  row.isNew ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {rank}
              </span>

              <span
                className={cn(
                  'flex-1 min-w-0 text-sm truncate',
                  row.isNew ? 'text-foreground font-semibold' : 'text-foreground',
                )}
              >
                {row.name}
              </span>

              <span className="text-title-2 text-foreground shrink-0">
                {row.avgScore.toFixed(1)}
              </span>

              {row.isNew && (
                <span className="shrink-0 rounded-chip bg-primary px-1.5 py-0.5 text-label-3 text-primary-foreground tracking-wider">
                  NEW
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
