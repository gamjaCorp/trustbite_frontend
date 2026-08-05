import { publicFetch } from '@/network/server';
import type { RestaurantDetailResponse } from '@/types/restaurant';

// 가게 상세 — 공개 엔드포인트. 같은 가게를 여러 번 요청해도 Next fetch 캐시가 합친다
export function getRestaurant(restaurantId: number): Promise<RestaurantDetailResponse> {
  return publicFetch(`/api/restaurants/${restaurantId}`, { next: { revalidate: 60 } });
}
