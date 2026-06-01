'use client';

import { cn } from '@/lib/utils';
import { Surface } from '@/components/common/surface';
import { RankMedal } from '@/components/common/rank-medal';
import { ScoreStars } from '@/components/common/score-stars';
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

const VISIBLE_COUNT = 10;

// 리뷰 작성 중 내 랭킹 실시간 미리보기 — 별점 입력 시 순위 변동 시뮬레이션
export function RankingPreview({ myTopRestaurants }: Props) {
  const avgScore = useReviewAvgScore();
  const selected = useSelectedRestaurant();
  const targetName = selected?.name ?? '';

  const baseRows: PreviewRow[] = myTopRestaurants
    .slice(0, VISIBLE_COUNT)
    .map((r) => ({ isNew: false, name: r.name, avgScore: r.avgScore }));

  const allWithNew =
    avgScore > 0
      ? [...baseRows, { isNew: true, name: targetName, avgScore }].sort((a, b) => {
          if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
          if (a.isNew) return -1;
          if (b.isNew) return 1;
          return 0;
        })
      : baseRows;

  const rows = allWithNew.slice(0, VISIBLE_COUNT);
  const newRank =
    avgScore > 0 ? allWithNew.findIndex((r) => r.isNew) + 1 : null;
  const newVisible = newRank !== null && newRank <= VISIBLE_COUNT;

  return (
    <Surface variant="card" padding="md">
      <header className="mb-3">
        <h3 className="text-title-2 text-foreground">내 랭킹 미리보기</h3>
        <p className="text-caption-2 text-muted-foreground mt-0.5">
          별점 입력하면 위치가 바뀌어요
        </p>
      </header>

      {newRank !== null && !newVisible && (
        <p className="mb-2 rounded-xl bg-primary/5 px-3 py-2 text-caption-2 text-primary">
          별점 입력 시 <span className="font-semibold">{newRank}위</span>로 진입해요
        </p>
      )}

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
              <RankMedal rank={rank} />

              <span
                className={cn(
                  'flex-1 min-w-0 truncate',
                  row.isNew ? 'text-title-2 text-foreground' : 'text-body-2 text-foreground',
                )}
              >
                {row.name}
              </span>

              <ScoreStars score={row.avgScore} className="shrink-0" />

              {row.isNew && (
                <span className="shrink-0 rounded-chip bg-primary px-1.5 py-0.5 text-label-3 text-primary-foreground tracking-wider">
                  NEW
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Surface>
  );
}
