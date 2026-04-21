'use client';

import { useState } from 'react';
import { mockRankList, mockRealtimeReviews } from '@/data/mock-restaurant';
import { ExplorePanel } from '@/components/features/explore/explore-panel';
import { MapView } from '@/components/features/explore/map-view';
import { SearchThisArea } from '@/components/features/explore/search-this-area';
import { ViewToggle } from '@/components/features/explore/view-toggle';

export default function MapPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [areaMoved, setAreaMoved] = useState(false);

  const handlePinClick = (id: string) => {
    setActiveId(id);
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-restaurant-id="${id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleMapMoved = () => setAreaMoved(true);
  const handleAreaSearch = () => {
    setAreaMoved(false);
  };

  return (
    <div className="fixed inset-x-0 top-[97px] bottom-0 flex overflow-hidden">
      {/* 좌측 사이드바 (lg+) */}
      <aside className="hidden lg:flex lg:w-[440px] xl:w-[480px] flex-col border-r border-paper-edge/60 shadow-[4px_0_16px_-8px_rgba(0,0,0,0.08)] z-20">
        <ExplorePanel
          entries={mockRankList}
          realtimeReviews={mockRealtimeReviews}
          activeId={activeId}
        />
      </aside>

      {/* 메인 지도 영역 */}
      <div className="relative flex-1">
        <MapView
          entries={mockRankList}
          activeId={activeId}
          onPinClick={handlePinClick}
          onMapMoved={handleMapMoved}
        />

        {/* 리스트/지도 토글 */}
        <div className="absolute top-4 left-4 z-30 rounded-full bg-background/95 p-0.5 shadow-md ring-1 ring-border">
          <ViewToggle />
        </div>

        {/* 이 지역에서 검색 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:left-54 lg:translate-x-0 z-30">
          <SearchThisArea visible={areaMoved} onClick={handleAreaSearch} />
        </div>
      </div>
    </div>
  );
}
