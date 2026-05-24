// TODO: 1차 MVP 제외 — keyword → 첫 매칭 좌표. 백엔드 도착 시 통합 검색 API로 교체
'use client';

import { useQuery } from '@tanstack/react-query';

// keyword를 Kakao Places keywordSearch로 조회해 첫 결과 좌표 반환
export function useKeywordCenter(keyword: string | undefined) {
  return useQuery<{ lat: number; lng: number } | null>({
    queryKey: ['keyword-center', keyword ?? ''],
    queryFn: () =>
      new Promise((resolve) => {
        if (!keyword) return resolve(null);
        const places = new window.kakao.maps.services.Places();
        places.keywordSearch(keyword, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK && result[0]) {
            resolve({
              lat: parseFloat(result[0].y),
              lng: parseFloat(result[0].x),
            });
          } else {
            resolve(null);
          }
        });
      }),
    enabled:
      !!keyword &&
      typeof window !== 'undefined' &&
      !!window.kakao?.maps?.services,
    staleTime: 60 * 1000,
  });
}
