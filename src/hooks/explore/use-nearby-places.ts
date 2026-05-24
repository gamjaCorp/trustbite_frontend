// TODO: 1차 MVP 제외 — Kakao Local 임시 훅. 백엔드 도착 시 교체
'use client';

import { useQuery } from '@tanstack/react-query';
import { searchRestaurantsByRadius } from '@/api/kakao-local';
import { synthesizeEntry } from '@/lib/synthesize-restaurant';
import type { RegionalRankEntry } from '@/types/restaurant';
import type { SearchArea } from '@/components/features/explore/map-view';

export type { SearchArea };

export function useNearbyPlaces(area: SearchArea | null) {
  return useQuery<RegionalRankEntry[]>({
    queryKey: ['nearby-places', area],
    queryFn: async () => {
      if (!area) return [];
      const places = await searchRestaurantsByRadius(area.center, area.radius);
      return places.map((place, index) => synthesizeEntry(place, index));
    },
    enabled:
      !!area &&
      typeof window !== 'undefined' &&
      !!window.kakao?.maps?.services,
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });
}
