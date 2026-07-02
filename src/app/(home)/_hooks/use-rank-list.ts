'use client';

import { useMemo } from 'react';
import type { RegionalRankEntry } from '@/types/restaurant';
import {
  PAGE_SIZE,
  useRankActions,
  useRankAppliedArea,
  useRankCategory,
  useRankCurrentRegion,
  useRankFocusedEntry,
  useRankPendingArea,
  useRankResolvedKeyword,
  useRankVisibleCount,
} from '../_lib/region-rank-store';
import { useNearbyPlaces } from './use-nearby-places';

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
  const pendingArea = useRankPendingArea();
  const currentRegion = useRankCurrentRegion();
  const visibleCount = useRankVisibleCount();
  const searchKeyword = resolvedKeyword?.keyword;

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

  // hasMore·remainingCount는 여기서 1회 계산 — RankMapBlock·RankResultList 중복 인라인 계산 제거
  const hasMore = !focusedEntry && !pendingArea && visibleCount < rankedEntries.length;
  const remainingCount = Math.min(PAGE_SIZE, rankedEntries.length - visibleCount);

  return {
    isFetching,
    visibleEntries,
    rankedEntries,
    listRegion,
    focusedEntry,
    action,
    hasMore,
    remainingCount,
  };
}
