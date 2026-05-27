'use client';

import { useMemo, useState } from 'react';
import type { RegionalRankEntry } from '@/types/restaurant';
import type { SearchArea } from '@/lib/geo';
import { IntroCard } from '@/components/common/intro-card';
import { useNearbyPlaces } from './hooks/use-nearby-places';
import { usePlaceSearch } from './hooks/use-place-search';
import { usePinRowSync } from './hooks/use-pin-row-sync';
import { RankFilterControls } from './rank-filter-controls';
import { RankMapBlock } from './rank-map-block';
import { RankResultList } from './rank-result-list';
import RegionRankProvider, {
  useRankActions,
  useRankAppliedArea,
  useRankCategory,
} from '@/stores/region-rank-store';

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
      <IntroCard />
      <div ref={stickyRef} className="sticky top-[var(--header-height)] z-10 bg-background space-y-3 pt-3 pb-4">
        <RankFilterControls />
        <RankMapBlock
          entries={rankedEntries}
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
        />
      </div>
      <RankResultList
        entries={rankedEntries}
        activeId={effectiveActiveId}
        isFetching={isFetching}
        region={currentRegion}
      />
    </div>
  );
}
