'use client';

import { useMemo, useState } from 'react';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { Category, MyRestaurantEntry, SortKey } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { SortFilterBar } from './sort-filter-bar';
import { RestaurantTop3Card } from './restaurant-top3-card';
import { RestaurantRankItem } from './restaurant-rank-item';

interface Props {
  entries: MyRestaurantEntry[];
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
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-start">
      {/* LEFT: TOP 3 */}
      <div className="space-y-3">
        <h2 className="text-title-1 text-foreground">인생 맛집 TOP 3</h2>
        <div className="space-y-2">
          {top3.map((entry, i) => (
            <RestaurantTop3Card key={entry.id} entry={entry} displayRank={i + 1} />
          ))}
        </div>
      </div>

      {/* RIGHT: 전체 랭킹 */}
      <div className="space-y-1">
        <h2 className="text-title-1 text-foreground pb-2">전체 랭킹</h2>

        <div className="sticky top-[91px] bg-background z-10 py-2 border-b border-border/50">
          <SortFilterBar
            sort={sort}
            onSortChange={setSort}
            category={category}
            onCategoryChange={setCategory}
            region={region}
            onRegionChange={setRegion}
            regions={regions}
          />
        </div>

        {filteredList.length === 0 ? (
          <Empty className="border-0 py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UtensilsCrossed />
              </EmptyMedia>
              <EmptyTitle>아직 기록한 맛집이 없어요</EmptyTitle>
              <EmptyDescription>
                첫 맛집을 추가하면 나만의 미식 가이드가 시작돼요.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button className="gap-1.5 rounded-chip">
                <Plus className="w-4 h-4" />새 맛집 추가하기
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="pt-2">
            {filteredList.map((entry, i) => (
              <RestaurantRankItem key={entry.id} entry={{ ...entry, rank: i + 1 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
