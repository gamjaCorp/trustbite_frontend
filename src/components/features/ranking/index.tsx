'use client';

import { useMemo, useState } from 'react';
import type { RegionalRankEntry } from '@/types/restaurant';
import type { SearchArea } from '@/lib/geo';
import { IntroCard } from '@/components/common/intro-card';
import { useNearbyPlaces } from './hooks/use-nearby-places';
import { usePinRowSync } from './hooks/use-pin-row-sync';
import { RankFilterControls } from './rank-filter-controls';
import { RankMapBlock } from './rank-map-block';
import { RankResultList } from './rank-result-list';
import RegionRankProvider, {
  useRankActions,
  useRankAppliedArea,
  useRankCategory,
  useRankResolvedKeyword,
} from '@/stores/region-rank-store';

// 백엔드 도착 시 서버 page 기반으로 교체 — 현재는 클라 slice 임시 처리
const PAGE_SIZE = 30;

interface Props {
  entries?: RegionalRankEntry[]; // entries가 없으면 Kakao Local API에서 자동으로 가져옴 (Storybook·테스트는 직접 주입 가능)
}

// 지역 랭킹 화면 — Provider로 스토어를 서브트리에 제공
export function RegionRankList({ entries }: Props) {
  return (
    <RegionRankProvider>
      <RegionRankListView entries={entries} />
    </RegionRankProvider>
  );
}

// 데이터 오케스트레이터 — 검색·fetch·랭크 부여·핀동기화, 브릿지 상태(pendingArea·currentRegion) 소유
function RegionRankListView({ entries: entriesProp }: Props) {
  const category = useRankCategory();
  const appliedArea = useRankAppliedArea();
  const action = useRankActions();

  const [pendingArea, setPendingArea] = useState<SearchArea | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 키워드 검색어 — 사용자가 가게명·음식을 확정(SearchAutocomplete)한 경우에만 적용됨
  const resolvedKeyword = useRankResolvedKeyword();
  const searchKeyword = resolvedKeyword?.keyword;

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

  // 결과셋 교체(새 영역·키워드·카테고리) 시 공개 개수 초기화 — 렌더 중 파생 상태 패턴
  const [prevFilteredList, setPrevFilteredList] = useState(filteredList);
  if (prevFilteredList !== filteredList) {
    setPrevFilteredList(filteredList);
    setVisibleCount(PAGE_SIZE);
  }

  // 전체 랭크 부여 목록 (더보기 카운트 기준)
  const rankedEntries = useMemo(
    () => filteredList.map((e, i) => ({ ...e, rank: i + 1 })),
    [filteredList],
  );

  // 현재 보이는 항목 — 핀·행·핀동기화 모두 이 slice 기준
  const visibleEntries = useMemo(
    () => rankedEntries.slice(0, visibleCount),
    [rankedEntries, visibleCount],
  );

  const { stickyRef, effectiveActiveId, handlePinClick } = usePinRowSync({
    entries: visibleEntries,
  });

  return (
    <div className="space-y-4">
      <IntroCard />
      <div
        ref={stickyRef}
        className="sticky top-[var(--header-height)] z-10 bg-background space-y-3 pt-3 pb-4"
      >
        <RankFilterControls onAreaConfirm={() => setPendingArea(null)} />
        <RankMapBlock
          entries={visibleEntries}
          activeId={effectiveActiveId}
          onPinClick={handlePinClick}
          pendingArea={pendingArea}
          onViewportChange={setPendingArea}
          onApplyPending={() => {
            if (pendingArea) {
              action.setAppliedArea(pendingArea);
              setPendingArea(null);
            }
          }}
          onRegionChange={setCurrentRegion}
          hasMore={!pendingArea && visibleCount < rankedEntries.length}
          remainingCount={Math.min(PAGE_SIZE, rankedEntries.length - visibleCount)}
          onLoadMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
        />
      </div>
      <RankResultList
        entries={visibleEntries}
        activeId={effectiveActiveId}
        isFetching={isFetching}
        region={currentRegion}
        remainingCount={Math.min(PAGE_SIZE, rankedEntries.length - visibleCount)}
        hasMore={!pendingArea && visibleCount < rankedEntries.length}
        onLoadMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
        onFocusMap={action.setActiveId}
      />
    </div>
  );
}
