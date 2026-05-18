'use client';

import { useMemo, useState } from 'react';
import { UtensilsCrossed, Plus, Share2, Check, MapPin } from 'lucide-react';
import { RegionalRankEntry, Category, SortKey, SceneTag } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { MyRestaurantCard } from '@/components/features/my-restaurant/my-restaurant-card';
import { CategoryChipRow, CATEGORIES, OCCASIONS } from '@/components/features/ranking/rank-filter-bar';
import { ChipSelect } from '@/components/core/chip-select';

const SORT_ITEMS = [
  { value: 'score', label: '점수순' },
  { value: 'recent', label: '최근 방문순' },
];

interface Props {
  entries: RegionalRankEntry[];
}

// my-places 전체 랭킹 — 헤더(타이틀/서브스탯/공유/정렬) + 카테고리·상황·지역 칩 필터 + 카드 리스트
export function RestaurantRankList({ entries }: Props) {
  const [sort, setSort] = useState<SortKey>('score');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [region, setRegion] = useState<string>('all');
  const [occasions, setOccasions] = useState<Set<SceneTag>>(new Set());

  const toggleOccasion = (tag: SceneTag) => {
    setOccasions((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const reviewedCount = useMemo(
    () => entries.filter((e) => e.myStatus === 'reviewed').length,
    [entries],
  );

  const regions = useMemo(
    () => Array.from(new Set(entries.map((e) => e.region))).sort(),
    [entries],
  );

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
    <div>
      {/* 섹션 헤더 */}
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="space-y-0.5">
          <h2 className="text-headline-2 text-foreground truncate">전체 랭킹</h2>
          <p className="text-caption-2 text-muted-foreground">
            내가 쓴 리뷰 <span className="">{reviewedCount}</span>개 ·{' '}
            <span className="">{entries.length}</span>곳 방문
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* TODO: 1차 MVP 제외 — 공유 기능 */}
          <button
            type="button"
            aria-label="공유"
            className="w-9 h-9 rounded-full border border-border bg-muted text-muted-foreground hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <ChipSelect
            value={region}
            onValueChange={setRegion}
            icon={MapPin}
            placeholder="전체 지역"
            items={[
              { value: 'all', label: '전체 지역' },
              ...regions.map((r) => ({ value: r, label: r })),
            ]}
          />
          <ChipSelect
            value={sort}
            onValueChange={(v) => setSort(v as SortKey)}
            items={SORT_ITEMS}
          />
        </div>
      </div>

      {/* sticky 필터 */}
      <div className="sticky top-[var(--header-height)] z-10 bg-background py-3 mt-3 space-y-2">
        <CategoryChipRow
          category={category}
          onCategoryChange={setCategory}
          categories={CATEGORIES}
        />

        <div className="mt-2 border-t border-dashed border-border/60" />

        {/* 상황 칩 행 */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-label-3 text-muted-foreground shrink-0">상황</span>
          {OCCASIONS.map((tag) => {
            const active = occasions.has(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggleOccasion(tag)}
                className={cn(
                  'inline-flex items-center gap-1 shrink-0 rounded-chip px-3 py-1.5 text-label-3 transition-colors',
                  active
                    ? 'bg-primary-subtle text-primary'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {active && <Check aria-hidden className="w-3.5 h-3.5" />}
                {tag}
              </button>
            );
          })}
        </div>

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
        <ul className="mt-6 border-hairline border-b border-border/60">
          {filteredList.map((entry, i) => (
            <li
              key={entry.id}
              className={cn(i > 0 && 'border-hairline border-t border-border/60')}
            >
              <MyRestaurantCard entry={{ ...entry, rank: i + 1 }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
