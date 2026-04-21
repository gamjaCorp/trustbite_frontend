'use client';

import { useState } from 'react';
import { Drawer } from 'vaul';
import type { RealtimeReview, RegionalRankEntry } from '@/types/restaurant';
import { ExplorePanel } from './explore-panel';

interface Props {
  entries: RegionalRankEntry[];
  realtimeReviews: RealtimeReview[];
  activeId?: string | null;
}

export function ExploreSheet({ entries, realtimeReviews, activeId }: Props) {
  const [snap, setSnap] = useState<number | string | null>('160px');

  return (
    <Drawer.Root
      open
      snapPoints={['160px', 0.5, 0.95]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      dismissible={false}
    >
      <Drawer.Portal>
        <Drawer.Content
          data-vaul-no-drag={false}
          className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex h-[95vh] max-w-[720px] flex-col rounded-t-modal bg-paper shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.15)] outline-none ring-1 ring-paper-edge/60"
        >
          <Drawer.Title className="sr-only">맛집 리스트</Drawer.Title>
          <Drawer.Description className="sr-only">
            드래그해서 맛집 리스트를 더 많이 보거나 지도를 크게 보세요.
          </Drawer.Description>

          {/* 드래그 핸들 */}
          <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-paper-edge" />

          {/* peek 상태에서 보이는 헤더 */}
          <div className="flex-1 overflow-hidden">
            <ExplorePanel
              entries={entries}
              realtimeReviews={realtimeReviews}
              activeId={activeId}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
