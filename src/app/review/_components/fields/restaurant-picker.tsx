'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { Search } from 'lucide-react';
import { Surface } from '@/components/common/display/surface';
import { RestaurantIdentityRow } from '@/components/common/restaurant/restaurant-identity-row';
import { RestaurantThumbnail } from '@/components/common/restaurant/restaurant-thumbnail';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { mapCategory } from '@/lib/mock/synthesize-restaurant';
import { searchPlacesByKeyword, type KakaoPlace } from '@/api/kakao/kakao-local';
import { useReviewActions } from '@/app/review/_lib/review-write-store';

// 리뷰 작성 음식점 검색 및 선택 — Kakao Local 실검색(위치 무관 전국 검색)
export function RestaurantPicker() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const { setSelectedRestaurant } = useReviewActions();

  const [loading] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? '',
    libraries: ['services'],
  });

  const trimmedQuery = debouncedQuery.trim();

  const { data: results = [], isFetching } = useQuery<KakaoPlace[]>({
    queryKey: ['review-restaurant-search', trimmedQuery],
    // center 생략 — 리뷰는 다녀온 가게라 현재 위치와 무관하게 전국 검색(홈 지도의 반경 검색과 구현 공유)
    queryFn: () => searchPlacesByKeyword(trimmedQuery),
    enabled:
      trimmedQuery.length > 0 &&
      !loading &&
      typeof window !== 'undefined' &&
      !!window.kakao?.maps?.services,
    staleTime: 60 * 1000,
  });

  const handleSelect = (place: KakaoPlace) => {
    const address = place.road_address_name || place.address_name;
    setSelectedRestaurant({
      id: place.id,
      name: place.place_name,
      category: mapCategory(place.category_name),
      region: place.address_name,
      imageUrl: '',
      subtitle: `${mapCategory(place.category_name)} · ${place.address_name}`,
      visitCount: 0,
      apiPlaceId: Number(place.id),
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
      address,
    });
  };

  const isOpen = trimmedQuery.length > 0;

  return (
    // relative — 아래 검색 결과 드롭다운이 absolute로 뜰 기준점 (문서 흐름에서 빠져 아래 필드를 밀지 않음)
    <div className="relative">
      <Surface variant="card" padding="sm">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="음식점 이름 또는 지역을 검색해주세요"
            className="flex-1 bg-transparent outline-none text-label-1 placeholder:text-muted-foreground"
            aria-label="음식점 검색"
          />
        </div>
      </Surface>

      {isOpen && (
        <Surface
          variant="card"
          padding="sm"
          className="absolute inset-x-0 top-full z-20 mt-2 shadow-card"
        >
          <p className="mb-1 px-1 text-caption-2 text-muted-foreground">검색 결과</p>

          {isFetching ? (
            <p className="px-3 py-6 text-center text-body-2 text-muted-foreground">
              검색 중이에요...
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-body-2 text-muted-foreground">
              검색 결과가 없어요
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(place)}
                    className="w-full flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/60 transition-colors"
                  >
                    <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <RestaurantThumbnail
                        src=""
                        alt={place.place_name}
                        category={mapCategory(place.category_name)}
                        showLabel={false}
                        className="absolute inset-0"
                      />
                    </div>

                    <RestaurantIdentityRow
                      name={place.place_name}
                      category={mapCategory(place.category_name)}
                      subtitle={place.address_name}
                      className="flex-1 text-left"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Surface>
      )}
    </div>
  );
}
