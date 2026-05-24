// TODO: 1차 MVP 제외 — Kakao Local 임시 어댑터. 백엔드 도착 시 src/api/restaurant/restaurant.ts로 교체

export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  phone: string;
  place_url: string;
  distance: string;
}

const MAX_PAGES = 3;

export function searchRestaurantsByRadius(
  center: { lat: number; lng: number },
  radius: number,
): Promise<KakaoPlace[]> {
  return new Promise((resolve, reject) => {
    const places = new window.kakao.maps.services.Places();
    const location = new window.kakao.maps.LatLng(center.lat, center.lng);

    const results: KakaoPlace[] = [];

    const fetchPage = (page: number) => {
      places.categorySearch(
        'FD6',
        (data, status, pagination) => {
          if (status === window.kakao.maps.services.Status.OK) {
            results.push(...(data as unknown as KakaoPlace[]));
            if (pagination.hasNextPage && page < MAX_PAGES) {
              fetchPage(page + 1);
            } else {
              resolve(results);
            }
          } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            resolve(results);
          } else {
            reject(new Error('Kakao Places 검색 실패'));
          }
        },
        { location, radius, page },
      );
    };

    fetchPage(1);
  });
}
