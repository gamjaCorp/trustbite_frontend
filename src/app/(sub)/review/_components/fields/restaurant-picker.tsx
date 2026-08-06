'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { SearchInput, SearchInputItem } from '@/components/core/search-input';
import { RestaurantIdentityRow } from '@/components/common/restaurant/restaurant-identity-row';
import { RestaurantThumbnail } from '@/components/common/restaurant/restaurant-thumbnail';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { mapCategory } from '@/lib/mock/synthesize-restaurant';
import { searchPlacesByKeyword, type KakaoPlace } from '@/api/kakao/kakao-local';
import { useReviewActions } from '../../_lib/review-write-store';

// 리뷰 작성 음식점 검색 및 선택 — Kakao Local 실검색(위치 무관 전국 검색)
export function RestaurantPicker() {
  const [query, setQuery] = useState('');
  const [dismissed, setDismissed] = useState(false);
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
    setDismissed(true);
  };

  const open = !dismissed && trimmedQuery.length > 0;

  return (
    <SearchInput<KakaoPlace>
      variant="filled"
      query={query}
      onQueryChange={(value) => {
        setQuery(value);
        setDismissed(false);
      }}
      placeholder="음식점 이름 또는 지역을 검색해주세요"
      inputProps={{ 'aria-label': '음식점 검색', autoFocus: true }}
      open={open}
      onOpenChange={(next) => {
        if (!next) setDismissed(true);
      }}
      onSelect={handleSelect}
      itemLabel={(place) => place.place_name}
      listLabel="검색 결과"
    >
      {isFetching || results.length === 0 ? (
        <p className="px-3 py-6 text-center text-body-2 text-muted-foreground">
          {isFetching ? '검색 중이에요...' : '검색 결과가 없어요'}
        </p>
      ) : (
        results.map((place) => (
          <SearchInputItem key={place.id} value={place}>
            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
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
          </SearchInputItem>
        ))
      )}
    </SearchInput>
  );
}
