'use client';

import { useMemo } from 'react';
import { UtensilsCrossed, Plus, Share2, MapPin } from 'lucide-react';
import { RegionalRankEntry, Category, SceneTag } from '@/lib/types/restaurant';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/core/empty-state';
import { PlaceListRow, toPlaceListRowData } from '@/components/common/place-list-row';
import { SectionHeader } from '@/components/common/section-header';
import { DividedList } from '@/components/common/divided-list';
import { CategoryChipRow } from '@/components/common/category-chip-row';
import { CATEGORIES, OCCASIONS } from '@/lib/domain/category';
import { SelectList } from '@/components/core/select-list';
import { IconButton } from '@/components/core/icon-button';
import { SceneTagChipRow } from '@/components/common/scene-tag-chip-row';
import MyRankFilterProvider, {
  useMyRankCategory,
  useMyRankFilterActions,
  useMyRankOccasions,
  useMyRankRegion,
  useMyRankSort,
} from '@/stores/my-rank-filter-store';

const SORT_ITEMS = [
  { value: 'score', label: '점수순' },
  { value: 'recent', label: '최근 방문순' },
];

interface Props {
  entries: RegionalRankEntry[];
}

// my-places 전체 랭킹 — Provider로 필터 스토어를 서브트리에 제공
export function RestaurantRankList({ entries }: Props) {
  return (
    <MyRankFilterProvider>
      <RestaurantRankListView entries={entries} />
    </MyRankFilterProvider>
  );
}

// 렌더링 전담 — 필터 상태는 store hook으로 직접 구독
function RestaurantRankListView({ entries }: Props) {
  const sort = useMyRankSort();
  const category = useMyRankCategory();
  const region = useMyRankRegion();
  const occasions = useMyRankOccasions();
  const action = useMyRankFilterActions();

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
            <IconButton icon={Share2} aria-label="공유" disabled />
            <SelectList
              value={region}
              onValueChange={action.setRegion}
              icon={MapPin}
              placeholder="전체 지역"
              items={[
                { value: 'all', label: '전체 지역' },
                ...regions.map((r) => ({ value: r, label: r })),
              ]}
            />
            <SelectList
              value={sort}
              onValueChange={(v) => action.setSort(v as 'score' | 'recent')}
              items={SORT_ITEMS}
            />
          </>
        }
      />

      {/* sticky 필터 */}
      <div className="sticky top-[var(--header-height)] z-10 bg-background py-3 mt-3 space-y-2">
        <CategoryChipRow
          category={category}
          onCategoryChange={(c) => action.setCategory(c as Category | 'all')}
          categories={CATEGORIES}
        />

        <div className="mt-2 border-t border-dashed border-border" />

        {/* 상황 칩 행 */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-label-3 text-muted-foreground shrink-0">상황</span>
          <SceneTagChipRow
            tags={OCCASIONS}
            isActive={(t) => occasions.has(t as SceneTag)}
            onToggle={(t) => action.toggleOccasion(t as SceneTag)}
          />
        </div>

      </div>

      {filteredList.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="아직 기록한 맛집이 없어요"
          description="첫 맛집을 추가하면 나만의 미식 가이드가 시작돼요."
          cta={
            <Button className="gap-1.5 rounded-chip">
              <Plus className="w-4 h-4" />새 맛집 추가하기
            </Button>
          }
        />
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
