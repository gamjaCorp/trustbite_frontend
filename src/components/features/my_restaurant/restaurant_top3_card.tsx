import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_STYLE } from '@/lib/category';
import { RestaurantRankEntry } from '@/types/restaurant';

interface Props {
  entry: RestaurantRankEntry;
  displayRank: number;
}

const RANK_MEDALS: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export function RestaurantTop3Card({ entry, displayRank }: Props) {
  const { id, name, category, region, imageUrl, avgScore } = entry;
  const medal = RANK_MEDALS[displayRank] ?? '';

  return (
    <Link
      href={`/restaurant/${id}`}
      className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 shadow-card hover:shadow-md transition-shadow"
    >
      <span className="text-xl shrink-0">{medal}</span>

      <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-semibold truncate">{name}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className={cn('rounded-chip px-1.5 py-0.5', CATEGORY_STYLE[category])}>
            {category}
          </span>
          <span>·</span>
          <span>{region}</span>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-grade-s text-grade-s" />
        <span className="text-sm font-bold">{avgScore.toFixed(1)}</span>
      </div>
    </Link>
  );
}
