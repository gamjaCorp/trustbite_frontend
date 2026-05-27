'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { StoreApi, createStore, useStore } from 'zustand';

import type { Category, SceneTag } from '@/types/restaurant';
import type { SearchArea } from '@/lib/geo';

type CategoryFilter = Category | 'all';
type ResolvedKeyword = { query: string; keyword: string | undefined };

interface RegionRankState {
  category: CategoryFilter;        // 선택된 카테고리 칩 (기본 'all')
  query: string;                   // 검색창 입력값 (지명 이동 후 자동 초기화)
  activeId: string | null;         // 핀 클릭으로 선택된 맛집 ID → 행 하이라이트
  occasions: Set<SceneTag>;        // 선택된 상황 태그 (다중, 토글)
  appliedArea: SearchArea | null;  // 현재 검색에 사용 중인 영역 (중심 + 반경) — 원 고정 기준
  resolvedKeyword: ResolvedKeyword | null; // 검색어 휴리스틱 판정 결과 (지명 이동인지 키워드 필터인지)
}

interface RegionRankActions {
  setCategory: (c: CategoryFilter) => void;
  setQuery: (q: string) => void;
  setActiveId: (id: string | null) => void;
  toggleOccasion: (tag: SceneTag) => void;
  setAppliedArea: (area: SearchArea) => void;
  setResolvedKeyword: (resolved: ResolvedKeyword) => void;
  // 지명 이동: 중심 교체(반경 유지) + keyword 비움 + 검색창 초기화
  navigateToArea: (center: { lat: number; lng: number }, matchedQuery: string) => void;
}

type RegionRankStore = RegionRankState & { action: RegionRankActions };

const RegionRankContext = createContext<StoreApi<RegionRankStore> | null>(null);

// 지역 랭킹 화면의 검색·필터·지도 공유 상태를 서브트리에 제공하는 스토어
export default function RegionRankProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() =>
    createStore<RegionRankStore>((set) => ({
      category: 'all',
      query: '',
      activeId: null,
      occasions: new Set(),
      appliedArea: null,
      resolvedKeyword: null,
      action: {
        setCategory: (c) => set({ category: c }),
        setQuery: (q) => set({ query: q }),
        setActiveId: (id) => set({ activeId: id }),
        toggleOccasion: (tag) =>
          set((s) => {
            const next = new Set(s.occasions);
            if (next.has(tag)) next.delete(tag);
            else next.add(tag);
            return { occasions: next };
          }),
        setAppliedArea: (area) => set({ appliedArea: area }),
        setResolvedKeyword: (resolved) => set({ resolvedKeyword: resolved }),
        navigateToArea: (center, matchedQuery) =>
          set((s) => ({
            appliedArea: s.appliedArea
              ? { center, radius: s.appliedArea.radius }
              : { center, radius: 1000 },
            resolvedKeyword: { query: matchedQuery, keyword: undefined },
            query: '',
          })),
      },
    })),
  );

  return <RegionRankContext.Provider value={store}>{children}</RegionRankContext.Provider>;
}

const useRegionRankStore = <T,>(selector: (s: RegionRankStore) => T): T => {
  const store = useContext(RegionRankContext);
  if (!store) throw new Error('RegionRankProvider 내부에서만 사용 가능합니다');
  return useStore(store, selector);
};

export const useRankCategory = () => useRegionRankStore((s) => s.category);
export const useRankQuery = () => useRegionRankStore((s) => s.query);
export const useRankActiveId = () => useRegionRankStore((s) => s.activeId);
export const useRankOccasions = () => useRegionRankStore((s) => s.occasions);
export const useRankAppliedArea = () => useRegionRankStore((s) => s.appliedArea);
export const useRankResolvedKeyword = () => useRegionRankStore((s) => s.resolvedKeyword);
export const useRankActions = () => useRegionRankStore((s) => s.action);
