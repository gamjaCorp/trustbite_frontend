'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { StoreApi, createStore, useStore } from 'zustand';

import type { Category, SceneTag, SortKey } from '@/lib/types/restaurant';

interface MyRankFilterState {
  sort: SortKey; // 정렬 기준 (기본 'score')
  category: Category | 'all'; // 카테고리 필터 (기본 'all')
  region: string; // 지역 필터 (기본 'all' = 전체)
  occasions: Set<SceneTag>; // 상황 태그 다중 필터 (기본 비어 있음)
}

interface MyRankFilterActions {
  setSort: (sort: SortKey) => void;
  setCategory: (category: Category | 'all') => void;
  setRegion: (region: string) => void;
  toggleOccasion: (tag: SceneTag) => void;
}

type MyRankFilterStore = MyRankFilterState & { action: MyRankFilterActions };

const MyRankFilterContext = createContext<StoreApi<MyRankFilterStore> | null>(null);

// my-places 전체 랭킹의 정렬·카테고리·지역·상황 필터 상태를 서브트리에 제공하는 스토어
export default function MyRankFilterProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() =>
    createStore<MyRankFilterStore>((set) => ({
      sort: 'score',
      category: 'all',
      region: 'all',
      occasions: new Set(),
      action: {
        setSort: (sort) => set({ sort }),
        setCategory: (category) => set({ category }),
        setRegion: (region) => set({ region }),
        toggleOccasion: (tag) =>
          set((s) => {
            const next = new Set(s.occasions);
            if (next.has(tag)) next.delete(tag);
            else next.add(tag);
            return { occasions: next };
          }),
      },
    })),
  );

  return <MyRankFilterContext.Provider value={store}>{children}</MyRankFilterContext.Provider>;
}

const useMyRankFilterStore = <T,>(selector: (s: MyRankFilterStore) => T): T => {
  const store = useContext(MyRankFilterContext);
  if (!store) throw new Error('MyRankFilterProvider 내부에서만 사용 가능합니다');
  return useStore(store, selector);
};

export const useMyRankSort = () => useMyRankFilterStore((s) => s.sort);
export const useMyRankCategory = () => useMyRankFilterStore((s) => s.category);
export const useMyRankRegion = () => useMyRankFilterStore((s) => s.region);
export const useMyRankOccasions = () => useMyRankFilterStore((s) => s.occasions);
export const useMyRankFilterActions = () => useMyRankFilterStore((s) => s.action);
