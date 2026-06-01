// TODO: 1차 MVP 제외 — Kakao Geocoder 보강 훅. 백엔드 도착 시 교체
'use client';

import { useQuery } from '@tanstack/react-query';
import type { Coordinates } from '@/lib/types/restaurant/type';

interface LocationMeta {
  buildingName?: string;
  administrativeArea?: string;
}

// coord2Address + coord2RegionCode 병렬 호출로 건물명·행정동 보강
export function useLocationMeta(coordinates: Coordinates, enabled = true) {
  return useQuery<LocationMeta>({
    queryKey: ['location-meta', coordinates.lat, coordinates.lng],
    queryFn: () =>
      new Promise((resolve) => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const latlng = new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng);

        let buildingName: string | undefined;
        let administrativeArea: string | undefined;
        let done = 0;

        const finish = () => {
          done++;
          if (done === 2) resolve({ buildingName, administrativeArea });
        };

        // coord2Address 실제 응답 구조: { address, road_address }[] — SDK 타입 정의가 부정확해 unknown 캐스팅
        geocoder.coord2Address(
          latlng.getLng(),
          latlng.getLat(),
          (result: unknown, status: kakao.maps.services.Status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const items = result as { road_address?: { building_name?: string } | null }[];
              buildingName = items[0]?.road_address?.building_name || undefined;
            }
            finish();
          },
        );

        geocoder.coord2RegionCode(
          latlng.getLng(),
          latlng.getLat(),
          (result: kakao.maps.services.RegionCode[], status: kakao.maps.services.Status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const hRegion = result.find((r) => r.region_type === 'H');
              administrativeArea = hRegion?.region_3depth_name || undefined;
            }
            finish();
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
