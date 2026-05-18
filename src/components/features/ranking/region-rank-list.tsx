'use client';

import { useMemo, useState } from 'react';
import { Check, MapPin, Sparkles } from 'lucide-react';
import { Category, RegionalRankEntry, SceneTag } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { RegionRankEmpty } from './region-rank-empty';
import { MapView, type MapBounds } from '@/components/features/explore/map-view';
import { SearchThisArea } from '@/components/features/explore/search-this-area';
import { IntroCard } from '@/components/common/intro-card';
import { SearchInput } from '@/components/core/search-input';
import { ChipSelect } from '@/components/core/chip-select';
import { RegionalRankCard } from './regional-rank-card';
import { CategoryChipRow, CATEGORIES } from './rank-filter-bar';

interface Props {
  entries: RegionalRankEntry[];
}

const OCCASIONS: SceneTag[] = ['혼밥', '데이트', '회식'];

type ExploreSort = 'rank' | 'trust' | 'recent';

function isInsideBounds(coords: { lat: number; lng: number }, bounds: MapBounds): boolean {
  return (
    coords.lat >= bounds.sw.lat &&
    coords.lat <= bounds.ne.lat &&
    coords.lng >= bounds.sw.lng &&
    coords.lng <= bounds.ne.lng
  );
}

export function RegionRankList({ entries }: Props) {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [region, setRegion] = useState<string>('all');
  const [sort, setSort] = useState<ExploreSort>('rank');
  const [occasions, setOccasions] = useState<Set<SceneTag>>(new Set());

  // 지도 bounds 상태 — applied: 마지막 "재검색" 시점, pending: 현재 지도 상태
  const [appliedBounds, setAppliedBounds] = useState<MapBounds | null>(null);
  const [pendingBounds, setPendingBounds] = useState<MapBounds | null>(null);

  // 지역 옵션 — entries에서 동적 추출
  const regions = useMemo(
    () => Array.from(new Set(entries.map((e) => e.region))).sort(),
    [entries],
  );

  const areaMoved = useMemo(() => {
    if (!pendingBounds || !appliedBounds) return false;
    const sw1 = appliedBounds.sw;
    const ne1 = appliedBounds.ne;
    const sw2 = pendingBounds.sw;
    const ne2 = pendingBounds.ne;
    const eps = 1e-5;
    return (
      Math.abs(sw1.lat - sw2.lat) > eps ||
      Math.abs(sw1.lng - sw2.lng) > eps ||
      Math.abs(ne1.lat - ne2.lat) > eps ||
      Math.abs(ne1.lng - ne2.lng) > eps
    );
  }, [appliedBounds, pendingBounds]);

  const handleBoundsChange = (bounds: MapBounds) => {
    setPendingBounds(bounds);
    // 첫 로드 시 자동으로 적용 (사용자 입력 없이도 화면을 보여주기 위해)
    setAppliedBounds((prev) => prev ?? bounds);
  };

  const handleAreaSearch = () => {
    if (pendingBounds) setAppliedBounds(pendingBounds);
  };

  const toggleOccasion = (tag: SceneTag) => {
    setOccasions((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  // 지도 bounds + region + category + query 필터 → sort 적용
  const filteredList = useMemo(() => {
    let list = appliedBounds
      ? entries.filter((e) => isInsideBounds(e.coordinates, appliedBounds))
      : entries;
    if (region !== 'all') list = list.filter((e) => e.region === region);
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
      // mock에 createdAt 없음 — id 역순 임시 적용 (Week 2 데이터 레이어에서 교체)
      sorted.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      sorted.sort((a, b) => b.communityAvgScore - a.communityAvgScore || a.rank - b.rank);
    }
    return sorted;
  }, [entries, appliedBounds, region, category, query, sort]);

  // 핀 표시용: 현재 보이는 영역의 결과 전체에 1~N 랭크 부여
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
        {/* row 1: 검색 + 지역 */}
        <div className="flex gap-2">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="맛집, 지역, 메뉴 검색"
            className="flex-1"
          />
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
        </div>

        {/* row 3: 카테고리 + 상황 묶음 */}
        <div className="flex flex-col gap-2">
          <CategoryChipRow
            category={category}
            onCategoryChange={setCategory}
            categories={CATEGORIES}
          />

          <div className="border-t border-dashed border-border/60" />

          {/* 상황 태그 (다중 선택) — UI만, Week 2 데이터 연결 시 필터 적용 */}
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

        {/* row 4: 임베드 지도 */}
        <div className="relative h-80 rounded-2xl overflow-hidden border border-border">
          <MapView
            entries={rankedEntries}
            activeId={effectiveActiveId}
            onPinClick={handlePinClick}
            onBoundsChange={handleBoundsChange}
          />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
            <SearchThisArea visible={areaMoved} onClick={handleAreaSearch} />
          </div>
        </div>
      </div>

      {rankedEntries.length === 0 ? (
        <RegionRankEmpty />
      ) : (
        <section className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-headline-2 text-foreground truncate">
              {dominantRegion ? `${dominantRegion} 일대 맛집` : '이 지역 맛집'}
            </h2>
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1 text-caption-2 text-muted-foreground min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">
                  이번 주 신뢰도 80%+ 리뷰만 반영 ·{' '}
                  <span className="">{rankedEntries.length}</span>곳
                </span>
              </p>
              <ChipSelect
                value={sort}
                onValueChange={(v) => setSort(v as ExploreSort)}
                items={[
                  { value: 'rank', label: '랭킹순' },
                  { value: 'trust', label: '신뢰도순' },
                  { value: 'recent', label: '최신순' },
                ]}
              />
            </div>
          </div>
          {/* 0.5px 분리선 — border-hairline 유틸리티 사용 */}
          <ul className="border-hairline border-y border-border/60">
            {rankedEntries.map((entry, i) => (
              <li
                key={entry.id}
                className={cn(i > 0 && 'border-hairline border-t border-border/60')}
              >
                <RegionalRankCard entry={entry} active={effectiveActiveId === entry.id} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
