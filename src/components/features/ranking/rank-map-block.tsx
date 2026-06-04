'use client';

import type { RegionalRankEntry } from '@/lib/types/restaurant';
import {
  useRankActions,
  useRankAppliedArea,
  useRankFocusedEntry,
  useRankPendingArea,
} from '@/stores/region-rank-store';
import { MapView } from './explore/index';
import { SearchThisArea } from './explore/search-this-area';
import { LoadMoreButton } from './explore/load-more-button';

interface RankMapBlockProps {
  entries: RegionalRankEntry[]; // 랭크 부여된 결과 (핀 표시용)
  activeId: string | null; // 핀 하이라이트 대상
  onPinClick: (id: string) => void; // 핀 클릭 → 행 스크롤
  hasMore: boolean; // 더 불러올 항목 존재 여부 — SearchThisArea와 상호 배타
  remainingCount: number; // 더보기 버튼에 표시할 남은 개수
  onLoadMore: () => void; // 더보기 클릭 핸들러
}

// 지도 컨테이너 — MapView + "이 지역 재검색" / "더보기" 오버레이 (상호 배타)
// pendingArea·currentRegion·focusedEntry는 store에서 직접 구독 — 이 컴포넌트가 store 경계
export function RankMapBlock({
  entries,
  activeId,
  onPinClick,
  hasMore,
  remainingCount,
  onLoadMore,
}: RankMapBlockProps) {
  const appliedArea = useRankAppliedArea();
  const pendingArea = useRankPendingArea();
  const focusedEntry = useRankFocusedEntry();
  const action = useRankActions();

  return (
    <div className="relative h-80 rounded-2xl overflow-hidden border border-border">
      <MapView
        entries={entries}
        activeId={activeId}
        onPinClick={onPinClick}
        onAreaChanged={action.setAppliedArea}
        // focus 모드 중엔 viewport 변화를 무시 — 재검색 버튼이 뜨지 않아야 함
        onViewportChange={focusedEntry ? () => {} : action.setPendingArea}
        appliedArea={appliedArea}
        onRegionChange={action.setCurrentRegion}
      />
      <div className="absolute top-3 inset-x-0 z-10 grid justify-items-center pointer-events-none">
        <div className="row-start-1 col-start-1">
          <SearchThisArea
            visible={!focusedEntry && !!pendingArea}
            onClick={action.applyPendingArea}
          />
        </div>
        <div className="row-start-1 col-start-1">
          <LoadMoreButton visible={hasMore} count={remainingCount} onClick={onLoadMore} />
        </div>
      </div>
    </div>
  );
}
