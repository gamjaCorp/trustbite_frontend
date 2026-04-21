import { RegionalRankEntry } from '@/types/restaurant';
import { RegionalRankCard } from './regional-rank-card';

interface Props {
  entries: RegionalRankEntry[];
}

export function Top3Highlight({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <section className="space-y-3 pt-4">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        🏆 TOP 3
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {entries.map((entry) => (
          <RegionalRankCard key={entry.id} entry={entry} variant="featured" />
        ))}
      </div>
    </section>
  );
}
