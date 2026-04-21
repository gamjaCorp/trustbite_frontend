'use client';

import { useMemo, useState } from 'react';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { Category, RealtimeReview, RegionalRankEntry, SortKey } from '@/types/restaurant';
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
import { RegionSelector } from './region-selector';
import { RegionalRankCard } from './regional-rank-card';
import { Top3Highlight } from './top3-highlight';
import { RealtimeReviews } from './realtime-reviews';

interface Props {
  entries: RegionalRankEntry[];
  realtimeReviews: RealtimeReview[];
  activeId?: string | null;
}

export function RegionRankList({ entries, realtimeReviews, activeId }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('score');
  const [category, setCategory] = useState<Category | 'all'>('all');

  const regionOptions = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => map.set(e.region, (map.get(e.region) ?? 0) + 1));
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({ name, count }));
  }, [entries]);

  // region + category 필터 적용 목록
  const filteredList = useMemo(() => {
    let list = selectedRegion === 'all' ? entries : entries.filter((e) => e.region === selectedRegion);
    if (category !== 'all') list = list.filter((e) => e.category === category);
    return [...list].sort((a, b) =>
      sort === 'score'
        ? b.communityAvgScore - a.communityAvgScore || a.rank - b.rank
        : b.lastVisitedAt.getTime() - a.lastVisitedAt.getTime(),
    );
  }, [entries, selectedRegion, category, sort]);

  // TOP 3: filteredList 상위 3개
  const top3 = useMemo(
    () => filteredList.slice(0, 3).map((e, i) => ({ ...e, rank: i + 1 })),
    [filteredList],
  );

  // 실시간 평가: region만 필터 (category 무관)
  const regionReviews = useMemo(() => {
    if (selectedRegion === 'all') return realtimeReviews;
    const regionEntryIds = new Set(
      entries.filter((e) => e.region === selectedRegion).map((e) => e.id),
    );
    return realtimeReviews.filter((r) => regionEntryIds.has(r.restaurantId));
  }, [realtimeReviews, entries, selectedRegion]);

  return (
    <div className="space-y-1">
      {/* sticky 필터 바 */}
      <div className="sticky top-[91px] bg-background z-10 py-2 border-b border-border/50">
        <div className="flex items-center gap-2 flex-wrap">
          <RegionSelector
            regions={regionOptions}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />
          <div className="w-px h-4 bg-border shrink-0" />
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
      </div>

      {filteredList.length === 0 ? (
        <Empty className="border-0 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UtensilsCrossed />
            </EmptyMedia>
            <EmptyTitle>이 지역엔 아직 맛집이 없어요</EmptyTitle>
            <EmptyDescription>
              첫 번째로 맛집을 추가하고 랭킹을 만들어보세요.
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
          <Top3Highlight entries={top3} />

          {/* 2. 실시간 평가 */}
          <RealtimeReviews reviews={regionReviews} />

          {/* 3. 전체 랭킹 */}
          <section className="pt-6 space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              전체 랭킹 <span className="text-sm font-normal text-muted-foreground">· {filteredList.length}곳</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredList.map((entry, i) => (
                <RegionalRankCard
                  key={entry.id}
                  entry={{ ...entry, rank: i + 1 }}
                  active={activeId === entry.id}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
