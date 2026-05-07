import { RegionalRankEntry } from '@/types/restaurant';
import { RegionalRankCard } from './regional-rank-card';

interface Props {
  entries: RegionalRankEntry[];
  region?: string | 'all';
}

export function Top3Highlight({ entries, region = 'all' }: Props) {
  if (entries.length === 0) return null;

  const title = region === 'all' ? '이번 주 TOP 3' : `이번 주 ${region} TOP 3`;

  return (
    <section className="space-y-3 pt-2">
      <div className="space-y-0.5">
        <h2 className="text-headline-3 text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">
          신뢰도 80% 이상 리뷰어의 평가만 반영한 주간 랭킹
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {entries.map((entry) => (
          <RegionalRankCard key={entry.id} entry={entry} variant="featured" />
        ))}
      </div>
    </section>
  );
}
