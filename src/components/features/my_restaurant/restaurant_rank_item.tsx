import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_STYLE } from '@/lib/category';
import { RestaurantRankEntry } from '@/types/restaurant';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  entry: RestaurantRankEntry;
}

const RANK_COLORS: Record<number, string> = {
  1: 'text-grade-s',
  2: 'text-grade-a',
  3: 'text-grade-b',
};

export function RestaurantRankItem({ entry }: Props) {
  const { id, rank, name, category, imageUrl, comment, scores, avgScore, visitCount, lastVisitedAt } = entry;

  const rankColor = RANK_COLORS[rank] ?? 'text-muted-foreground';
  const lastVisited = formatDistanceToNow(lastVisitedAt, { addSuffix: true, locale: ko });

  const isFirst = rank === 1;

  return (
    <Link
      href={`/restaurant/${id}`}
      className={cn(
        'group flex items-center gap-4 rounded-card shadow-card p-3 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200',
        isFirst ? 'bg-primary/5 border border-primary/20' : 'bg-card',
      )}
    >
      {/* 순위 */}
      <div className="w-8 shrink-0 text-center">
        {isFirst ? (
          <span className="text-xl">👑</span>
        ) : (
          <span className={cn('text-xl font-bold', rankColor)}>{rank}</span>
        )}
      </div>

      {/* 썸네일 */}
      <div className="relative w-24 h-16 shrink-0 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 본문 */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold truncate">{name}</span>
          <span className={cn('text-xs rounded-chip px-2 py-0.5 shrink-0', CATEGORY_STYLE[category])}>
            {category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-2 truncate">{comment}</p>
        <p className="text-xs text-muted-foreground">
          맛 {scores.taste}&nbsp;|&nbsp;가성비 {scores.value}&nbsp;|&nbsp;분위기 {scores.vibe}
        </p>
        <p className="text-xs text-muted-foreground" suppressHydrationWarning>
          {visitCount}번 방문 · {lastVisited}
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
