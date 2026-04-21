'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Sparkles, UtensilsCrossed } from 'lucide-react';
import type { Category, RealtimeReview, RegionalRankEntry, SortKey } from '@/types/restaurant';
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
import { RegionSelector } from '@/components/features/ranking/region-selector';
import { RegionalRankCard } from '@/components/features/ranking/regional-rank-card';
import { ActivityPulse } from './activity-pulse';
import { CoordinateReadout } from './coordinate-readout';

interface Props {
  entries: RegionalRankEntry[];
  realtimeReviews: RealtimeReview[];
  activeId?: string | null;
}

export function ExplorePanel({ entries, realtimeReviews, activeId }: Props) {
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

  const filteredList = useMemo(() => {
    let list = selectedRegion === 'all' ? entries : entries.filter((e) => e.region === selectedRegion);
    if (category !== 'all') list = list.filter((e) => e.category === category);
    return [...list].sort((a, b) =>
      sort === 'score'
        ? b.communityAvgScore - a.communityAvgScore || a.rank - b.rank
        : b.lastVisitedAt.getTime() - a.lastVisitedAt.getTime(),
    );
  }, [entries, selectedRegion, category, sort]);

  return (
    <div className="flex flex-col h-full bg-paper">
      {/* Field Book 헤더 — 등고선 패턴 */}
      <div className="relative border-b border-paper-edge/60 topographic-lines">
        <div className="relative px-5 pt-5 pb-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-numeric text-xs tracking-[0.2em] text-ink/70 uppercase">
                  SEOUL · 37.55°N
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-none">
                맛집 탐색
              </h1>
              <p className="text-xs text-ink/80 pt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                신뢰도 기반 검증된 맛집 {filteredList.length}곳
              </p>
            </div>
          </div>

          <ActivityPulse reviews={realtimeReviews} />
        </div>
      </div>

      {/* 필터 스택 */}
      <div className="px-5 py-3 border-b border-paper-edge/40 bg-paper/80 backdrop-blur-sm sticky top-0 z-10 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/60" />
          <input
            type="text"
            placeholder="가게명, 지역으로 검색"
            className="w-full h-9 pl-9 pr-3 rounded-full bg-background border border-paper-edge text-sm placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <RegionSelector
            regions={regionOptions}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />
          <div className="w-px h-4 bg-paper-edge shrink-0" />
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

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
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
          <ul className="space-y-2.5">
            {filteredList.map((entry, i) => (
              <li key={entry.id}>
                <div className="space-y-1">
                  <RegionalRankCard
                    entry={{ ...entry, rank: i + 1 }}
                    variant="compact"
                    active={activeId === entry.id}
                  />
                  <div className="px-3">
                    <CoordinateReadout coords={entry.coordinates} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
