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
import { PlaceListRow, toPlaceListRowData } from '@/components/common/place-list-row';
import { SectionHeader } from '@/components/common/section-header';
import { DividedList } from '@/components/common/divided-list';
import { CategoryChipRow } from '@/components/common/category-chip-row';
import { CATEGORIES, OCCASIONS } from '@/lib/category';
import { SelectList } from '@/components/core/select-list';

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
      <SectionHeader
        title="전체 랭킹"
        subtitle={`내가 쓴 리뷰 ${reviewedCount}개 · ${entries.length}곳 방문`}
        className="px-1"
        rightAction={
          <>
            {/* TODO: 1차 MVP 제외 — 공유 기능 */}
            <div
              aria-disabled="true"
              className="w-9 h-9 rounded-full border border-border bg-muted text-muted-foreground flex items-center justify-center opacity-35 cursor-not-allowed"
            >
              <Share2 className="w-4 h-4" />
            </div>
            <SelectList
              value={region}
              onValueChange={setRegion}
              icon={MapPin}
              placeholder="전체 지역"
              items={[
                { value: 'all', label: '전체 지역' },
                ...regions.map((r) => ({ value: r, label: r })),
              ]}
            />
            <SelectList
              value={sort}
              onValueChange={(v) => setSort(v as SortKey)}
              items={SORT_ITEMS}
            />
          </>
        }
      />

      {/* sticky 필터 */}
      <div className="sticky top-[var(--header-height)] z-10 bg-background py-3 mt-3 space-y-2">
        <CategoryChipRow
          category={category}
          onCategoryChange={setCategory}
          categories={CATEGORIES}
        />

        <div className="mt-2 border-t border-dashed border-border" />

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
        <DividedList
          items={filteredList}
          keyFn={(e) => e.id}
          listClassName="mt-6 border-b border-border"
          renderItem={(entry, i) => (
            <PlaceListRow variant="my" data={toPlaceListRowData({ ...entry, rank: i + 1 })} />
          )}
        />
      )}
    </div>
  );
}
