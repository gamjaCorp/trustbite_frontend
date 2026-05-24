'use client';

import { useMemo, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Category, RegionalRankEntry, SceneTag } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { RegionRankEmpty } from './region-rank-empty';
import { MapView, type SearchArea } from '@/components/features/explore/map-view';
import { IntroCard } from '@/components/common/intro-card';
import { SearchInput } from '@/components/core/search-input';
import { SelectList } from '@/components/core/select-list';
import { PlaceListRow, toPlaceListRowData } from '@/components/common/place-list-row';
import { CategoryChipRow, CATEGORIES, OCCASIONS } from './rank-filter-bar';
import { useNearbyPlaces } from '@/hooks/explore/use-nearby-places';

interface Props {
  // entries가 없으면 Kakao Local API에서 자동으로 가져옴 (Storybook·테스트는 직접 주입 가능)
  entries?: RegionalRankEntry[];
}

type ExploreSort = 'rank' | 'trust' | 'recent';

export function RegionRankList({ entries: entriesProp }: Props) {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sort, setSort] = useState<ExploreSort>('rank');
  const [occasions, setOccasions] = useState<Set<SceneTag>>(new Set());

  // 지도 idle 시 계산된 viewport 영역 (center + radius). 자동 재검색 트리거
  const [appliedArea, setAppliedArea] = useState<SearchArea | null>(null);

  // entriesProp 없으면 Kakao Local에서 area 기반으로 자동 fetch
  const { data: kakaoEntries = [] } = useNearbyPlaces(entriesProp ? null : appliedArea);
  const entries = entriesProp ?? kakaoEntries;

  const handleAreaChange = (area: SearchArea) => {
    setAppliedArea(area);
  };

  const toggleOccasion = (tag: SceneTag) => {
    setOccasions((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  // category + query 필터 → sort 적용 (원형 필터는 Kakao 서버측에서 처리됨)
  const filteredList = useMemo(() => {
    let list = entries;
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
    const sorted = [...list];
    if (sort === 'trust') {
      sorted.sort((a, b) => b.trustScore - a.trustScore);
    } else if (sort === 'recent') {
      // TODO: 백엔드 도착 시 실제 createdAt으로 교체 — 현재 id 역순 임시 적용
      sorted.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      // Kakao 응답 순서(인기·거리 휴리스틱)를 랭킹 신호로 사용
      sorted.sort((a, b) => a.rank - b.rank);
    }
    return sorted;
  }, [entries, category, query, sort]);

  // 핀 표시용: 현재 보이는 결과에 1~N 랭크 부여
  const rankedEntries = useMemo(
    () => filteredList.map((e, i) => ({ ...e, rank: i + 1 })),
    [filteredList],
  );

  // 현재 결과의 대표 지역 — 가장 많이 등장한 region 한 곳
  const dominantRegion = useMemo(() => {
    if (rankedEntries.length === 0) return null;
    const counts = new Map<string, number>();
    rankedEntries.forEach((e) => counts.set(e.region, (counts.get(e.region) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];
  }, [rankedEntries]);

  // 핀 클릭 → 해당 카드로 스크롤
  const handlePinClick = (id: string) => {
    setActiveId(id);
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-restaurant-id="${id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  // 현재 화면에 없는 항목은 active 상태를 무시 (별도 setState 없이 파생)
  const effectiveActiveId = useMemo(
    () => (activeId && rankedEntries.some((e) => e.id === activeId) ? activeId : null),
    [activeId, rankedEntries],
  );

  return (
    <div className="space-y-4">
      {/* IntroCard — 검색 input 위, 1회 노출 (localStorage 게이트 내장) */}
      <IntroCard />

      {/* sticky 블록 — 깔때기 구조: 능동→공간→콘텐츠1→콘텐츠2→지도 */}
      <div className="sticky top-[var(--header-height)] z-10 bg-background space-y-3 pt-3 pb-4">
        {/* row 1: 검색 */}
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="맛집, 지역, 메뉴 검색"
          className="w-full mb-4"
        />

        {/* row 3: 카테고리 + 상황 묶음 */}
        <div className="flex flex-col gap-2">
          <CategoryChipRow
            category={category}
            onCategoryChange={setCategory}
            categories={CATEGORIES}
          />

          <div className="border-t border-dashed border-border" />

          {/* 상황 태그 (다중 선택) — UI만, Week 3 데이터 연결 시 필터 적용 */}
          <div className="flex items-center gap-2">
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

        {/* row 4: 임베드 지도 — 원이 viewport에 꽉 차게 표시되고 idle 시 자동 재검색 */}
        <div className="relative h-80 rounded-2xl overflow-hidden border border-border">
          <MapView
            entries={rankedEntries}
            activeId={effectiveActiveId}
            onPinClick={handlePinClick}
            onAreaChanged={handleAreaChange}
          />
        </div>
      </div>

      {rankedEntries.length === 0 ? (
        <RegionRankEmpty />
      ) : (
        <section className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-headline-2 text-foreground truncate">
                {dominantRegion ? `${dominantRegion} 일대 맛집` : '이 지역 맛집'}
              </h2>
              <SelectList
                value={sort}
                onValueChange={(v) => setSort(v as ExploreSort)}
                items={[
                  { value: 'rank', label: '랭킹순' },
                  { value: 'trust', label: '신뢰도순' },
                  { value: 'recent', label: '최신순' },
                ]}
              />
            </div>
            <p className="inline-flex items-center gap-1 text-caption-2 text-muted-foreground min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">
                이번 주 신뢰도 80%+ 리뷰만 반영 ·{' '}
                <span className="">{rankedEntries.length}</span>곳
              </span>
            </p>
          </div>
          <ul className="border-y border-border">
            {rankedEntries.map((entry, i) => (
              <li
                key={entry.id}
                className={cn(i > 0 && 'border-t border-border')}
              >
                <PlaceListRow variant="regional" data={toPlaceListRowData(entry)} active={effectiveActiveId === entry.id} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
