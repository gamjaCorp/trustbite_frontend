'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Category, RegionalRankEntry } from '@/types/restaurant';
import { CATEGORY_STYLE } from '@/lib/category';
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
import { MapView, type MapBounds } from '@/components/features/explore/map-view';
import { SearchThisArea } from '@/components/features/explore/search-this-area';
import { RegionalRankCard } from './regional-rank-card';

interface Props {
  entries: RegionalRankEntry[];
}

const CATEGORIES: Array<Category | 'all'> = [
  'all',
  '한식',
  '일식',
  '중식',
  '양식',
  '카페',
  '술집',
  '기타',
];

function isInsideBounds(
  coords: { lat: number; lng: number },
  bounds: MapBounds,
): boolean {
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

  // 지도 bounds 상태 — applied: 마지막 "재검색" 시점, pending: 현재 지도 상태
  const [appliedBounds, setAppliedBounds] = useState<MapBounds | null>(null);
  const [pendingBounds, setPendingBounds] = useState<MapBounds | null>(null);

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

  // 지도 bounds + category + query 필터 적용 → 점수 내림차순 고정
  const filteredList = useMemo(() => {
    let list = appliedBounds
      ? entries.filter((e) => isInsideBounds(e.coordinates, appliedBounds))
      : entries;
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
    return [...list].sort(
      (a, b) => b.communityAvgScore - a.communityAvgScore || a.rank - b.rank,
    );
  }, [entries, appliedBounds, category, query]);

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
      {/* sticky 블록 — 필터 바 + 지도가 함께 헤더 아래에 고정 */}
      <div className="sticky top-[var(--header-height)] z-10 bg-background space-y-3 pt-3 pb-4">
        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="맛집, 지역, 메뉴 검색"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
        </div>

        {/* 카테고리 칩 */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'shrink-0 rounded-chip px-3 py-1.5 text-label-3 transition-colors',
                category === c
                  ? c === 'all'
                    ? 'bg-foreground text-background'
                    : CATEGORY_STYLE[c as Category]
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {c === 'all' ? '전체' : c}
            </button>
          ))}
        </div>

        {/* 임베드 지도 */}
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
        <Empty className="border-0 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UtensilsCrossed />
            </EmptyMedia>
            <EmptyTitle>이 지역엔 맛집이 없어요</EmptyTitle>
            <EmptyDescription>
              지도를 옮기거나 다른 검색어·필터로 다시 시도해보세요.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button className="gap-1.5 rounded-chip">
              <Plus className="w-4 h-4" />새 맛집 추가하기
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <section className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              {dominantRegion ? `${dominantRegion} 일대 맛집` : '이 지역 맛집'}
            </h2>
            <p className="inline-flex items-center gap-1 text-caption-2 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              이번 주 신뢰도 80%+ 리뷰만 반영 ·{' '}
              <span className="font-numeric">{rankedEntries.length}</span>곳
            </p>
          </div>
          {/* 0.5px 분리선 — border-hairline 유틸리티 사용 */}
          <ul className="border-hairline border-y border-border/60">
            {rankedEntries.map((entry, i) => (
              <li
                key={entry.id}
                className={cn(
                  i > 0 && 'border-hairline border-t border-border/60',
                )}
              >
                <RegionalRankCard
                  entry={entry}
                  active={effectiveActiveId === entry.id}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
