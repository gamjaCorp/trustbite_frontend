'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, UtensilsCrossed } from 'lucide-react';
import { Category, RegionalRankEntry, SortKey } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { SortFilterBar } from '@/components/features/my-restaurant/sort-filter-bar';
import { ViewToggle } from '@/components/features/explore/view-toggle';
import { RegionSelector } from './region-selector';
import { RegionalRankCard } from './regional-rank-card';
import { Top3Highlight } from './top3-highlight';

interface Props {
  entries: RegionalRankEntry[];
  activeId?: string | null;
}

export function RegionRankList({ entries, activeId }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('score');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');

  const regionOptions = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => map.set(e.region, (map.get(e.region) ?? 0) + 1));
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({ name, count }));
  }, [entries]);

  // region + category + query 필터 적용 목록
  const filteredList = useMemo(() => {
    let list = selectedRegion === 'all' ? entries : entries.filter((e) => e.region === selectedRegion);
    if (category !== 'all') list = list.filter((e) => e.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.region.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) =>
      sort === 'score'
        ? b.communityAvgScore - a.communityAvgScore || a.rank - b.rank
        : b.lastVisitedAt.getTime() - a.lastVisitedAt.getTime(),
    );
  }, [entries, selectedRegion, category, query, sort]);

  // TOP 3: filteredList 상위 3개
  const top3 = useMemo(
    () => filteredList.slice(0, 3).map((e, i) => ({ ...e, rank: i + 1 })),
    [filteredList],
  );

  // 맛집 랭킹: TOP 3 제외한 4위~
  const restList = useMemo(
    () => filteredList.slice(3).map((e, i) => ({ ...e, rank: i + 4 })),
    [filteredList],
  );

  return (
    <div className="space-y-4">
      {/* sticky 필터 바 */}
      <div className="sticky top-[91px] bg-background z-10 py-3 border-b border-border/50 space-y-3">
        <div className="flex items-center gap-2">
          {/* 검색 */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="맛집, 지역, 메뉴 검색"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
            />
          </div>
          <RegionSelector
            regions={regionOptions}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />
          <ViewToggle />
        </div>
        <SortFilterBar
          sort={sort}
          onSortChange={setSort}
          category={category}
          onCategoryChange={setCategory}
          region="all"
          onRegionChange={() => {}}
          regions={[]}
        />
      </div>

      {filteredList.length === 0 ? (
        <Empty className="border-0 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UtensilsCrossed />
            </EmptyMedia>
            <EmptyTitle>검색 결과가 없어요</EmptyTitle>
            <EmptyDescription>
              다른 검색어나 필터로 다시 시도해보세요.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button className="gap-1.5 rounded-chip">
              <Plus className="w-4 h-4" />새 맛집 추가하기
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          {/* 1. TOP 3 하이라이트 */}
          <Top3Highlight entries={top3} region={selectedRegion} />

          {/* 2. 전체 랭킹 (4위~) */}
          {restList.length > 0 && (
            <section className="pt-8 space-y-3">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-foreground">맛집 랭킹</h2>
                <p className="text-xs text-muted-foreground">
                  총 {filteredList.length}곳
                </p>
              </div>
              <ul className="space-y-3">
                {restList.map((entry) => (
                  <li key={entry.id}>
                    <RegionalRankCard
                      entry={entry}
                      variant="compact"
                      active={activeId === entry.id}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
