'use client';

import { useMemo, useState } from 'react';
import { Check, MapPin } from 'lucide-react';
import { RegionalRankEntry } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { RegionRankEmpty } from './region-rank-empty';
import { RegionRankSkeleton } from './region-rank-skeleton';
import { MapView } from './explore/index';
import type { SearchArea } from '@/lib/geo';
import { IntroCard } from '@/components/common/intro-card';
import { SearchInput } from '@/components/core/search-input';
import { PlaceListRow, toPlaceListRowData } from '@/components/common/place-list-row';
import { CategoryChipRow, CATEGORIES, OCCASIONS } from './rank-filter-bar';
import { SelectList, type SelectListItem } from '@/components/core/select-list';
import { SearchThisArea } from './explore/search-this-area';
import { useNearbyPlaces } from './hooks/use-nearby-places';
import { usePlaceSearch } from './hooks/use-place-search';
import { usePinRowSync } from './hooks/use-pin-row-sync';
import RegionRankProvider, {
  useRankActions,
  useRankAppliedArea,
  useRankCategory,
  useRankOccasions,
  useRankQuery,
} from '@/stores/region-rank-store';

interface Props {
  // entries가 없으면 Kakao Local API에서 자동으로 가져옴 (Storybook·테스트는 직접 주입 가능)
  entries?: RegionalRankEntry[];
}

// TODO: 1차 MVP 제외 — 백엔드 도착 시 sort state 연결 후 disabled 제거
const SORT_ITEMS: SelectListItem[] = [
  { value: 'rank', label: '랭킹순' },
  { value: 'trust', label: '신뢰도순' },
  { value: 'recent', label: '최신순' },
];

// 지역 랭킹 화면 — Provider로 스토어를 서브트리에 제공
export function RegionRankList({ entries }: Props) {
  return (
    <RegionRankProvider>
      <RegionRankListView entries={entries} />
    </RegionRankProvider>
  );
}

// 실제 화면 렌더링 — 스토어 selector hook을 소비
function RegionRankListView({ entries: entriesProp }: Props) {
  const category = useRankCategory();
  const query = useRankQuery();
  const occasions = useRankOccasions();
  const appliedArea = useRankAppliedArea();
  const action = useRankActions();

  const [pendingArea, setPendingArea] = useState<SearchArea | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);

  const { searchKeyword } = usePlaceSearch({ onNavigate: () => setPendingArea(null) });

  // entriesProp 없으면 Kakao Local에서 area + keyword 기반으로 fetch
  const { data: kakaoEntries = [], isFetching } = useNearbyPlaces({
    area: entriesProp ? null : appliedArea,
    keyword: searchKeyword,
  });
  const entries = entriesProp ?? kakaoEntries;

  // category 필터 → keyword는 서버(Kakao keywordSearch)에서 이미 처리됨
  const filteredList = useMemo(() => {
    let list = entries;
    if (category !== 'all') list = list.filter((e) => e.category === category);
    return [...list].sort((a, b) => a.rank - b.rank);
  }, [entries, category]);

  // 핀 표시용: 현재 보이는 결과에 1~N 랭크 부여
  const rankedEntries = useMemo(
    () => filteredList.map((e, i) => ({ ...e, rank: i + 1 })),
    [filteredList],
  );

  const { stickyRef, effectiveActiveId, handlePinClick } = usePinRowSync({ entries: rankedEntries });

  return (
    <div className="space-y-4">
      {/* IntroCard — 검색 input 위, 1회 노출 (localStorage 게이트 내장) */}
      <IntroCard />

      {/* sticky 블록 — 깔때기 구조: 능동→공간→콘텐츠1→콘텐츠2→지도 */}
      <div ref={stickyRef} className="sticky top-[var(--header-height)] z-10 bg-background space-y-3 pt-3 pb-4">
        {/* row 1: 검색 */}
        <SearchInput
          value={query}
          onValueChange={action.setQuery}
          placeholder="맛집, 지역, 메뉴 검색"
          className="w-full mb-4"
        />

        {/* row 3: 카테고리 + 상황 묶음 */}
        <div className="flex flex-col gap-2">
          <CategoryChipRow
            category={category}
            onCategoryChange={action.setCategory}
            categories={CATEGORIES}
          />

          <div className="border-t border-dashed border-border" />

          {/* 상황 태그 (다중 선택) — UI만, Week 3 데이터 연결 시 필터 적용 */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-label-3 text-muted-foreground shrink-0">상황</span>
            {OCCASIONS.map((tag) => {
              const active = occasions.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => action.toggleOccasion(tag)}
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

        {/* row 4: 임베드 지도 — 드래그/줌 후 버튼 클릭으로 재검색 */}
        <div className="relative h-80 rounded-2xl overflow-hidden border border-border">
          <MapView
            entries={rankedEntries}
            activeId={effectiveActiveId}
            onPinClick={handlePinClick}
            onAreaChanged={action.setAppliedArea}
            onViewportChange={setPendingArea}
            appliedArea={appliedArea}
            onRegionChange={setCurrentRegion}
          />
          <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none z-10">
            <SearchThisArea
              visible={!!pendingArea}
              onClick={() => {
                if (pendingArea) {
                  action.setAppliedArea(pendingArea);
                  setPendingArea(null);
                }
              }}
            />
          </div>
        </div>
      </div>

      {rankedEntries.length === 0 ? (
        isFetching ? <RegionRankSkeleton /> : <RegionRankEmpty />
      ) : (
        <section className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-headline-2 text-foreground truncate">
                {currentRegion ? `${currentRegion} 일대 맛집` : '이 지역 맛집'}
              </h2>
              <SelectList
                value="rank"
                onValueChange={() => {}}
                items={SORT_ITEMS}
                disabled
                className="shrink-0"
              />
            </div>
            <p className="inline-flex items-center gap-1 text-caption-2 text-muted-foreground min-w-0">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">이 영역에 {rankedEntries.length}곳</span>
            </p>
          </div>
          <ul className="border-y border-border">
            {rankedEntries.map((entry, i) => (
              <li
                key={entry.id}
                className={cn(i > 0 && 'border-t border-border')}
              >
                <PlaceListRow variant="regional" minimal={!entry.hasRealData} data={toPlaceListRowData(entry)} active={effectiveActiveId === entry.id} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
