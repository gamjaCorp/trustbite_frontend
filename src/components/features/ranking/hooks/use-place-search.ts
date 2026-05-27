'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useRankActions, useRankQuery, useRankResolvedKeyword } from '@/stores/region-rank-store';

interface UsePlaceSearchOptions {
  onNavigate?: () => void; // 지도 이동이 끝났을 때 추가로 실행해야 할 일
}

// 검색어가 지역/장소인지 음식/가게명인지 판정, 지도 이동 또는 목록 필터로 연결하는 hook
export function usePlaceSearch({ onNavigate }: UsePlaceSearchOptions = {}) {
  const query = useRankQuery();
  const resolvedKeyword = useRankResolvedKeyword();
  const action = useRankActions();

  // onNavigate가 바뀌어도 검색 판정 effect가 다시 실행되지 않도록 최신 콜백만 ref에 보관한다.
  const onNavigateRef = useRef(onNavigate);
  useLayoutEffect(() => {
    onNavigateRef.current = onNavigate;
  });

  const debouncedQuery = useDebouncedValue(query.trim(), 500);

  // 현재 검색어에 대해 keyword 필터로 확정된 경우에만 목록 검색어로 노출한다.
  const searchKeyword =
    debouncedQuery && resolvedKeyword?.query === debouncedQuery
      ? resolvedKeyword.keyword
      : undefined;

  // 카카오 장소 API로 검색어의 성격을 판정한다.
  // 지역/장소면 지도 이동, 아니면 목록 필터로 사용한다.
  useEffect(() => {
    if (!debouncedQuery) return;
    if (typeof window === 'undefined' || !window.kakao?.maps?.services) return;
    let cancelled = false;

    // 1. 먼저 주소 검색을 시도해 동/구/시 같은 행정구역 검색어를 지도 이동으로 처리한다.
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(debouncedQuery, (addrResult, addrStatus) => {
      if (cancelled) return;
      if (addrStatus === window.kakao.maps.services.Status.OK && addrResult[0]) {
        action.navigateToArea(
          { lat: parseFloat(addrResult[0].y), lng: parseFloat(addrResult[0].x) },
          debouncedQuery,
        );
        onNavigateRef.current?.();
        return;
      }
      // 2. 음식점,음식이름일경우 장소 검색을 시도, 역/관광명소일경우 지도 이동 대상으로 본다.
      const places = new window.kakao.maps.services.Places();
      places.keywordSearch(debouncedQuery, (kwResult, kwStatus) => {
        if (cancelled) return;
        if (kwStatus !== window.kakao.maps.services.Status.OK || !kwResult[0]) {
          action.setResolvedKeyword({ query: debouncedQuery, keyword: debouncedQuery });
          return;
        }
        const code = kwResult[0].category_group_code;
        if (code === 'SW8' || code === 'AT4') {
          action.navigateToArea(
            { lat: parseFloat(kwResult[0].y), lng: parseFloat(kwResult[0].x) },
            debouncedQuery,
          );
          onNavigateRef.current?.();
        } else {
          action.setResolvedKeyword({ query: debouncedQuery, keyword: debouncedQuery });
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, action]);

  return { searchKeyword };
}
