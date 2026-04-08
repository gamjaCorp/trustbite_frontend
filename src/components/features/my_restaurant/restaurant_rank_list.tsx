'use client';

import { useMemo, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Category, RestaurantRankEntry, SortKey } from '@/types/restaurant';
import { SortFilterBar } from './sort_filter_bar';
import { RestaurantTop3Card } from './restaurant_top3_card';
import { RestaurantRankItem } from './restaurant_rank_item';

interface Props {
  entries: RestaurantRankEntry[];
}

export function RestaurantRankList({ entries }: Props) {
  const [sort, setSort] = useState<SortKey>('score');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [region, setRegion] = useState<string | 'all'>('all');

  const regions = useMemo(
    () => Array.from(new Set(entries.map((e) => e.region))).sort(),
    [entries],
  );

  // TOP 3: 점수 기준 고정, 필터 미적용
  const top3 = useMemo(
    () =>
      [...entries]
        .sort((a, b) => b.avgScore - a.avgScore || a.rank - b.rank)
        .slice(0, 3),
    [entries],
  );

  // 전체 랭킹: 정렬 + 필터 적용
  const filteredList = useMemo(() => {
    let list = entries;

    if (category !== 'all') list = list.filter((e) => e.category === category);
    if (region !== 'all') list = list.filter((e) => e.region === region);

    return [...list].sort((a, b) =>
      sort === 'score'
        ? b.avgScore - a.avgScore || a.rank - b.rank
        : b.lastVisitedAt.getTime() - a.lastVisitedAt.getTime(),
    );
  }, [entries, category, region, sort]);

  return (
    <div className="space-y-6">
      {/* TOP 3 하이라이트 */}
      <div className="bg-primary-subtle rounded-2xl px-6 py-5 space-y-4">
        <h2 className="text-base font-semibold text-foreground">인생 맛집 TOP 3</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {top3.map((entry, i) => (
            <RestaurantTop3Card key={entry.id} entry={entry} displayRank={i + 1} />
          ))}
        </div>
      </div>

      {/* 전체 랭킹 */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-semibold text-foreground">전체 랭킹</h2>
        <SortFilterBar
          sort={sort}
          onSortChange={setSort}
          category={category}
          onCategoryChange={setCategory}
          region={region}
          onRegionChange={setRegion}
          regions={regions}
        />

        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <UtensilsCrossed className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">해당하는 맛집이 없어요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((entry, i) => (
              <RestaurantRankItem key={entry.id} entry={{ ...entry, rank: i + 1 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
