'use client';

import { useMemo, useState } from 'react';
import type { RegionalRankEntry } from '@/lib/types/restaurant';
import type { SearchArea } from '@/lib/geo';
import {
  useRankActions,
  useRankAppliedArea,
  useRankCategory,
  useRankFocusedEntry,
  useRankResolvedKeyword,
} from '@/stores/region-rank-store';
import { useNearbyPlaces } from './use-nearby-places';

const PAGE_SIZE = 30;

interface Options {
  entriesProp?: RegionalRankEntry[];
}

// 지역 랭킹 데이터 오케스트레이션 — fetch·필터·랭크 부여·페이지네이션
export function useRankList({ entriesProp }: Options) {
  const category = useRankCategory();
  const appliedArea = useRankAppliedArea();
  const focusedEntry = useRankFocusedEntry();
  const action = useRankActions();
  const resolvedKeyword = useRankResolvedKeyword();
  const searchKeyword = resolvedKeyword?.keyword;

  const [pendingArea, setPendingArea] = useState<SearchArea | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // focus 모드 중엔 fetch 불필요 — focusedEntry를 직접 목록으로 사용
  const { data: kakaoEntries = [], isFetching } = useNearbyPlaces({
    area: entriesProp || focusedEntry ? null : appliedArea,
    keyword: searchKeyword,
  });

  // category 필터 — focus 모드 중엔 단일 엔트리이므로 우회
  const filteredList = useMemo(() => {
    const entries = entriesProp ?? (focusedEntry ? [focusedEntry] : kakaoEntries);
    let list = entries;
    if (!focusedEntry && category !== 'all') list = list.filter((e) => e.category === category);
    return [...list].sort((a, b) => a.rank - b.rank);
  }, [entriesProp, focusedEntry, kakaoEntries, category]);

  // 결과셋 교체(새 영역·키워드·카테고리) 시 공개 개수 초기화 — 렌더 중 파생 상태 패턴
  const [prevFilteredList, setPrevFilteredList] = useState(filteredList);
  if (prevFilteredList !== filteredList) {
    setPrevFilteredList(filteredList);
    setVisibleCount(PAGE_SIZE);
  }

  const rankedEntries = useMemo(
    () => filteredList.map((e, i) => ({ ...e, rank: i + 1 })),
    [filteredList],
  );

  const visibleEntries = useMemo(
    () => rankedEntries.slice(0, visibleCount),
    [rankedEntries, visibleCount],
  );

  // focus 모드면 그 가게의 지역, 아니면 지도 역지오코딩 지역
  const listRegion = focusedEntry ? focusedEntry.region : currentRegion;

  return {
    isFetching,
    visibleEntries,
    rankedEntries,
    pendingArea,
    setPendingArea,
    currentRegion,
    setCurrentRegion,
    listRegion,
    focusedEntry,
    action,
    pageSize: PAGE_SIZE,
    visibleCount,
    setVisibleCount,
  };
}
