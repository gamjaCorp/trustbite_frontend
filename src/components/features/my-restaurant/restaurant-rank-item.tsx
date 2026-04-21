import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_STYLE } from '@/lib/category';
import { MyRestaurantEntry } from '@/types/restaurant';
import { TrustScoreBadge } from '@/components/common/trust-score-badge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  entry: MyRestaurantEntry & { trustScore?: number };
}

const RANK_COLORS: Record<number, string> = {
  1: 'text-grade-s',
  2: 'text-grade-a',
  3: 'text-grade-b',
};

export function RestaurantRankItem({ entry }: Props) {
  const { id, rank, name, category, region, imageUrl, avgScore, visitCount, lastVisitedAt, trustScore } =
    entry;

  const rankColor = RANK_COLORS[rank] ?? 'text-muted-foreground';
  const lastVisited = formatDistanceToNow(lastVisitedAt, { addSuffix: true, locale: ko });
  const isFirst = rank === 1;

  return (
    <Link
      href={`/restaurant/${id}`}
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-muted/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200',
        isFirst && 'border-l-2 border-primary',
      )}
    >
      {/* 순위 */}
      <div className="w-7 shrink-0 text-center">
        {isFirst ? (
          <span className="text-base leading-none">👑</span>
        ) : (
          <span className={cn('text-base font-bold', rankColor)}>{rank}</span>
        )}
      </div>

      {/* 썸네일 */}
      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>

      {/* 본문 */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-semibold truncate">{name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn('text-xs rounded-chip px-1.5 py-0.5', CATEGORY_STYLE[category])}>
            {category}
          </span>
          <span className="text-xs text-muted-foreground">{region}</span>
          <span className="text-xs text-muted-foreground" suppressHydrationWarning>
            · {visitCount}번 · {lastVisited}
          </span>
        </div>
      </div>

      {/* 평균 점수 + 신뢰도 */}
      <div className="shrink-0 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-grade-s text-grade-s" />
          <span className="text-sm font-bold">{avgScore.toFixed(1)}</span>
        </div>
        {typeof trustScore === 'number' && <TrustScoreBadge score={trustScore} size="sm" showIcon={false} />}
      </div>
    </Link>
  );
}
