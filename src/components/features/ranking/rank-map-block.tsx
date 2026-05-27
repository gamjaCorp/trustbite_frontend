'use client';

import type { RegionalRankEntry } from '@/types/restaurant';
import type { SearchArea } from '@/lib/geo';
import { useRankActions, useRankAppliedArea } from '@/stores/region-rank-store';
import { MapView } from './explore/index';
import { SearchThisArea } from './explore/search-this-area';

interface RankMapBlockProps {
  entries: RegionalRankEntry[]; // 랭크 부여된 결과 (핀 표시용)
  activeId: string | null; // 핀 하이라이트 대상
  onPinClick: (id: string) => void; // 핀 클릭 → 행 스크롤
  pendingArea: SearchArea | null; // 재검색 대기 영역 (버튼 표시 게이트)
  onViewportChange: (area: SearchArea) => void; // 드래그·줌 시 대기 영역 갱신
  onApplyPending: () => void; // "이 지역 재검색" 클릭 시 appliedArea 적용
  onRegionChange: (region: string | null) => void; // 중심 행정구역명 전달
}

// 지도 컨테이너 — MapView + "이 지역 재검색" 오버레이
export function RankMapBlock({
  entries,
  activeId,
  onPinClick,
  pendingArea,
  onViewportChange,
  onApplyPending,
  onRegionChange,
}: RankMapBlockProps) {
  // onAreaChanged(초기 타일 로드)는 부모 pendingArea와 독립적으로 발화하므로 store를 직접 연결
  const appliedArea = useRankAppliedArea();
  const action = useRankActions();

  return (
    <div className="relative h-80 rounded-2xl overflow-hidden border border-border">
      <MapView
        entries={entries}
        activeId={activeId}
        onPinClick={onPinClick}
        onAreaChanged={action.setAppliedArea}
        onViewportChange={onViewportChange}
        appliedArea={appliedArea}
        onRegionChange={onRegionChange}
      />
      <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none z-10">
        <SearchThisArea visible={!!pendingArea} onClick={onApplyPending} />
      </div>
    </div>
  );
}
