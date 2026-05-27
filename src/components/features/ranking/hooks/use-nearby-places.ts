'use client';

// TODO: 1차 MVP 제외 — Kakao Local 임시 훅. 백엔드 도착 시 교체

import { useQuery } from '@tanstack/react-query';
import { searchPlacesByRadius, searchPlacesByKeyword } from '@/api/kakao-local';
import { synthesizeEntry } from '@/lib/synthesize-restaurant';
import type { RegionalRankEntry } from '@/types/restaurant';
import type { SearchArea } from '@/lib/geo';

export interface NearbyPlacesInput {
  area: SearchArea | null;
  keyword?: string;
}

export function useNearbyPlaces({ area, keyword }: NearbyPlacesInput) {
  return useQuery<RegionalRankEntry[]>({
    queryKey: ['nearby-places', area, keyword ?? ''],
    queryFn: async () => {
      if (!area) return [];
      const places = keyword
        ? await searchPlacesByKeyword(keyword, area.center, area.radius)
        : await searchPlacesByRadius(area.center, area.radius);
      return places.map((place, index) => synthesizeEntry(place, index));
    },
    enabled:
      !!area &&
      typeof window !== 'undefined' &&
      !!window.kakao?.maps?.services,
    staleTime: 5 * 60 * 1000,
    placeholderData: [] as RegionalRankEntry[],
  });
}
