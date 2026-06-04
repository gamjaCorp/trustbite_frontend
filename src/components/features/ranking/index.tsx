'use client';

import type { RegionalRankEntry } from '@/lib/types/restaurant';
import { IntroCard } from '@/components/common/intro-card';
import { usePinRowSync } from './hooks/use-pin-row-sync';
import { useRankList } from './hooks/use-rank-list';
import { RankFilterControls } from './rank-filter-controls';
import { RankMapBlock } from './rank-map-block';
import { RankResultList } from './rank-result-list';
import RegionRankProvider from '@/stores/region-rank-store';

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

// 렌더링 전담 — 데이터 오케스트레이션은 useRankList에 위임
function RegionRankListView({ entries: entriesProp }: Props) {
  const {
    isFetching,
    visibleEntries,
    rankedEntries,
    pendingArea,
    setPendingArea,
    setCurrentRegion,
    listRegion,
    focusedEntry,
    action,
    pageSize,
    visibleCount,
    setVisibleCount,
  } = useRankList({ entriesProp });

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
          pendingArea={focusedEntry ? null : pendingArea}
          onViewportChange={focusedEntry ? () => {} : setPendingArea}
          onApplyPending={() => {
            if (pendingArea) {
              action.setAppliedArea(pendingArea);
              setPendingArea(null);
            }
          }}
          onRegionChange={setCurrentRegion}
          hasMore={!focusedEntry && !pendingArea && visibleCount < rankedEntries.length}
          remainingCount={Math.min(pageSize, rankedEntries.length - visibleCount)}
          onLoadMore={() => setVisibleCount((c) => c + pageSize)}
        />
      </div>
      <RankResultList
        entries={visibleEntries}
        activeId={effectiveActiveId}
        isFetching={isFetching}
        region={listRegion}
        remainingCount={Math.min(pageSize, rankedEntries.length - visibleCount)}
        hasMore={!focusedEntry && !pendingArea && visibleCount < rankedEntries.length}
        onLoadMore={() => setVisibleCount((c) => c + pageSize)}
        onFocusMap={action.setActiveId}
      />
    </div>
  );
}
