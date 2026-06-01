'use client';

import { useCallback, useMemo, useRef } from 'react';
import type { RegionalRankEntry } from '@/lib/types/restaurant/type';
import { useRankActiveId, useRankActions } from '@/stores/region-rank-store';

interface UsePinRowSyncOptions {
  entries: RegionalRankEntry[]; // 현재 화면에 표시 중인 (랭크 부여된) 결과 목록
}

// 핀↔행 동기화 — 핀 클릭 시 해당 행으로 스크롤·active 표시, 현재 결과에 없는 active는 무시
export function usePinRowSync({ entries }: UsePinRowSyncOptions) {
  const activeId = useRankActiveId();
  const action = useRankActions();

  // sticky 필터+지도 블록 — 핀 클릭 스크롤 오프셋 실측용
  const stickyRef = useRef<HTMLDivElement>(null);

  // 현재 화면에 없는 항목은 active 상태를 무시 (별도 setState 없이 파생)
  const effectiveActiveId = useMemo(
    () => (activeId && entries.some((e) => e.id === activeId) ? activeId : null),
    [activeId, entries],
  );

  // 핀 클릭 → 해당 카드로 스크롤 (sticky 블록 아래 12px에 행 상단을 맞춤)
  const handlePinClick = useCallback((id: string) => {
    action.setActiveId(id);
    requestAnimationFrame(() => {
      const row = document.querySelector(`[data-restaurant-id="${id}"]`);
      if (!row) return;
      const stickyBottom = stickyRef.current?.getBoundingClientRect().bottom ?? 0;
      const rowTop = row.getBoundingClientRect().top;
      window.scrollBy({ top: rowTop - stickyBottom - 12, behavior: 'smooth' });
    });
  }, [action]);

  return { stickyRef, effectiveActiveId, handlePinClick };
}
