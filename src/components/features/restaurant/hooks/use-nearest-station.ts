// TODO: 1차 MVP 제외 — 가장 가까운 지하철역 조회 훅. 백엔드 도착 시 교체
'use client';

import { useQuery } from '@tanstack/react-query';
import type { Coordinates } from '@/lib/types/restaurant';

interface NearestStation {
  name: string;
  walkMinutes: number;
}

// SW8(지하철역) 카테고리 검색으로 가장 가까운 역 이름·도보 분 반환
export function useNearestStation(coordinates: Coordinates, enabled = true) {
  return useQuery<NearestStation | null>({
    queryKey: ['nearest-station', coordinates.lat, coordinates.lng],
    queryFn: () =>
      new Promise((resolve) => {
        const places = new window.kakao.maps.services.Places();
        places.categorySearch(
          'SW8',
          (result: kakao.maps.services.PlacesSearchResult, status: kakao.maps.services.Status) => {
            if (status !== window.kakao.maps.services.Status.OK || result.length === 0) {
              resolve(null);
              return;
            }
            const nearest = result[0];
            const distanceM = parseInt(nearest.distance, 10);
            const walkMinutes = Math.ceil(distanceM / 80);
            resolve({ name: nearest.place_name, walkMinutes });
          },
          {
            location: new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng),
            radius: 1500,
            sort: window.kakao.maps.services.SortBy.DISTANCE,
          },
        );
      }),
    enabled:
      enabled &&
      typeof window !== 'undefined' &&
      !!window.kakao?.maps?.services,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
