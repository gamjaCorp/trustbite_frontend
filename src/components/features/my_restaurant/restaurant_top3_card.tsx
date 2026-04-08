import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_STYLE } from '@/lib/category';
import { RestaurantRankEntry } from '@/types/restaurant';

interface Props {
  entry: RestaurantRankEntry;
  displayRank: number;
}

const RANK_STYLES: Record<number, { color: string; medal: string }> = {
  1: { color: 'text-grade-s', medal: '🥇' },
  2: { color: 'text-grade-a', medal: '🥈' },
  3: { color: 'text-grade-b', medal: '🥉' },
};

export function RestaurantTop3Card({ entry, displayRank }: Props) {
  const { id, name, category, scores, avgScore } = entry;

  const { color, medal } = RANK_STYLES[displayRank] ?? { color: 'text-muted-foreground', medal: '' };

  return (
    <Link
      href={`/restaurant/${id}`}
      className="flex items-center gap-4 bg-white/70 rounded-xl px-4 py-3 hover:bg-white transition-colors"
    >
      {/* 순위 */}
      <span className={cn('text-2xl font-bold shrink-0', color)}>{medal}</span>

      {/* 본문 */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate">{name}</span>
          <span className={cn('text-xs rounded-chip px-2 py-0.5 shrink-0', CATEGORY_STYLE[category])}>
            {category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          맛 {scores.taste}&nbsp;|&nbsp;가성비 {scores.value}&nbsp;|&nbsp;분위기 {scores.vibe}
        </p>
      </div>

      {/* 평균 점수 */}
      <div className="shrink-0 flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-grade-s text-grade-s" />
        <span className="text-sm font-bold">{avgScore.toFixed(1)}</span>
      </div>
    </Link>
  );
}
