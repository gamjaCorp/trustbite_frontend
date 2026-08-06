import 'server-only';

import { auth } from '@/auth';
import { getUserRatings } from '@/api/rating/rating';
import { getRestaurant } from '@/api/restaurant/restaurant';
import type { RegionalRankEntry, RestaurantDetailResponse } from '@/types/restaurant';

import { toRankEntries } from './to-rank-entry';

export interface MyRatingsPage {
  entries: RegionalRankEntry[];
  totalElements: number; // 내가 쓴 후기 총 개수
  last: boolean; // 마지막 페이지 여부 — 더보기 버튼 노출 판단
}

const EMPTY_PAGE: MyRatingsPage = { entries: [], totalElements: 0, last: true };

// 내 후기 한 페이지를 화면용 행 목록으로. 후기 응답에 가게 정보가 id·이름뿐이라
// 등장하는 가게마다 상세를 한 번씩 더 부른다 (Next fetch 캐시가 중복 호출을 합친다)
export async function loadMyRatingsPage(page: number, size = 20): Promise<MyRatingsPage> {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (Number.isNaN(userId)) return EMPTY_PAGE;

  try {
    const ratingPage = await getUserRatings(userId, page, size);

    const restaurantIds = Array.from(new Set(ratingPage.content.map((r) => r.restaurantId)));
    const details = await Promise.all(
      restaurantIds.map((id) =>
        getRestaurant(id).catch(() => null as RestaurantDetailResponse | null),
      ),
    );
    const detailById = new Map(restaurantIds.map((id, i) => [id, details[i]]));

    return {
      entries: toRankEntries(ratingPage.content, detailById),
      totalElements: ratingPage.totalElements,
      last: ratingPage.last,
    };
  } catch {
    // 비로그인·네트워크 실패 — 이 라우트엔 error 바운더리가 없어 빈 목록으로 떨어뜨린다
    return EMPTY_PAGE;
  }
}
