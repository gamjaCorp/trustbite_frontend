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

function fetchCategory(
  code: 'FD6' | 'CE7',
  places: kakao.maps.services.Places,
  location: kakao.maps.LatLng,
  radius: number,
): Promise<KakaoPlace[]> {
  return new Promise((resolve, reject) => {
    const results: KakaoPlace[] = [];

    const fetchPage = (page: number) => {
      places.categorySearch(
        code,
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
            reject(new Error(`Kakao Places 검색 실패 (${code})`));
          }
        },
        { location, radius, page },
      );
    };

    fetchPage(1);
  });
}

export async function searchPlacesByRadius(
  center: { lat: number; lng: number },
  radius: number,
): Promise<KakaoPlace[]> {
  const places = new window.kakao.maps.services.Places();
  const location = new window.kakao.maps.LatLng(center.lat, center.lng);

  const [food, cafe] = await Promise.all([
    fetchCategory('FD6', places, location, radius),
    fetchCategory('CE7', places, location, radius),
  ]);

  const dedupe = new Map<string, KakaoPlace>();
  for (const p of [...food, ...cafe]) dedupe.set(p.id, p);

  return Array.from(dedupe.values()).sort(
    (a, b) => parseInt(a.distance, 10) - parseInt(b.distance, 10),
  );
}

function fetchKeywordPage(
  places: kakao.maps.services.Places,
  keyword: string,
  code: 'FD6' | 'CE7',
  location: kakao.maps.LatLng,
  radius: number,
): Promise<KakaoPlace[]> {
  return new Promise((resolve, reject) => {
    const results: KakaoPlace[] = [];

    const fetchPage = (page: number) => {
      places.keywordSearch(
        keyword,
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
            reject(new Error(`Kakao Places 키워드 검색 실패 (${code})`));
          }
        },
        { location, radius, page, category_group_code: code },
      );
    };

    fetchPage(1);
  });
}

export async function searchPlacesByKeyword(
  keyword: string,
  center: { lat: number; lng: number },
  radius: number,
): Promise<KakaoPlace[]> {
  const places = new window.kakao.maps.services.Places();
  const location = new window.kakao.maps.LatLng(center.lat, center.lng);

  const [food, cafe] = await Promise.all([
    fetchKeywordPage(places, keyword, 'FD6', location, radius),
    fetchKeywordPage(places, keyword, 'CE7', location, radius),
  ]);

  const dedupe = new Map<string, KakaoPlace>();
  for (const p of [...food, ...cafe]) dedupe.set(p.id, p);

  return Array.from(dedupe.values()).sort(
    (a, b) => parseInt(a.distance, 10) - parseInt(b.distance, 10),
  );
}
