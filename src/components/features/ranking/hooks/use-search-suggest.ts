'use client';

import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

// 자동완성 드롭다운에 표시되는 가게 항목
export interface SuggestItem {
  id: string; // Kakao place id
  name: string; // 가게명
  address: string; // 도로명 또는 지번 주소
  category: string; // 카테고리 마지막 세그먼트
  center: { lat: number; lng: number }; // 가게 중심 좌표
}

// 검색어 분류 결과 — 분류 진행 중에는 이전 상태 유지(깜빡임 방지), loading 상태 없음
export type SuggestState =
  | { kind: 'idle' } // 빈 입력 또는 초기 상태
  | { kind: 'area'; label: string; center: { lat: number; lng: number } } // 지역·역·관광지
  | { kind: 'keyword'; items: SuggestItem[] } // 가게·음식 키워드
  | { kind: 'none' }; // 결과 없음

// 입력어를 지역/가게/없음으로 분류하는 훅 — store 부수효과 없음
// 실제 이동·필터는 확정 핸들러(SearchAutocomplete)에서 처리
export function useSearchSuggest(query: string): SuggestState {
  const debouncedQuery = useDebouncedValue(query.trim(), 500);

  const [state, setState] = useState<SuggestState>({ kind: 'idle' });

  useEffect(() => {
    // debouncedQuery가 비어 있으면 effect 불필요 — render에서 idle 반환으로 처리
    if (!debouncedQuery) return;
    if (typeof window === 'undefined' || !window.kakao?.maps?.services) return;

    let cancelled = false;

    // 1단계: 주소 검색 — 동·구·시 같은 행정구역이면 area로 분류
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(debouncedQuery, (addrResult, addrStatus) => {
      if (cancelled) return;
      if (addrStatus === window.kakao.maps.services.Status.OK && addrResult[0]) {
        setState({
          kind: 'area',
          label: debouncedQuery,
          center: {
            lat: parseFloat(addrResult[0].y),
            lng: parseFloat(addrResult[0].x),
          },
        });
        return;
      }

      // 2단계: 키워드 검색 — 역/관광명소면 area, 그 외는 가게 목록
      const places = new window.kakao.maps.services.Places();
      places.keywordSearch(
        debouncedQuery,
        (kwResult, kwStatus) => {
          if (cancelled) return;
          if (kwStatus !== window.kakao.maps.services.Status.OK || kwResult.length === 0) {
            setState({ kind: 'none' });
            return;
          }
          const code = kwResult[0].category_group_code;
          if (code === 'SW8' || code === 'AT4') {
            // 지하철역(SW8) · 관광명소(AT4) → area 이동
            setState({
              kind: 'area',
              label: kwResult[0].place_name,
              center: {
                lat: parseFloat(kwResult[0].y),
                lng: parseFloat(kwResult[0].x),
              },
            });
          } else {
            // 가게·음식 키워드 → 드롭다운 항목
            const items: SuggestItem[] = kwResult.slice(0, 8).map((p) => ({
              id: p.id,
              name: p.place_name,
              address: p.road_address_name || p.address_name,
              category: p.category_name.split(' > ').at(-1) ?? p.category_name,
              center: { lat: parseFloat(p.y), lng: parseFloat(p.x) },
            }));
            setState({ kind: 'keyword', items });
          }
        },
        // 결과 관련성 높은 순, 최대 5건
        { size: 8 },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // query가 비어 있으면 항상 idle 반환 (debounce 전 잔여 결과 노출 방지)
  if (!query.trim()) return { kind: 'idle' };
  return state;
}
