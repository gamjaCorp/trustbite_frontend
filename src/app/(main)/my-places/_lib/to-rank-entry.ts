// 후기 응답 → 전체 랭킹 행(RegionalRankEntry) 변환 — 순수 함수, UI 의존 없음
import { ratingContextToSceneTag, toCategory } from '@/lib/domain/category';
import type { UserRatingResponse } from '@/types/rating';
import type { RegionalRankEntry, RestaurantDetailResponse } from '@/types/restaurant';

// 광역 시·도 접두 제거 — 주소에서 표시용 지역명만 뽑기 위함
const SI_DO_PREFIX = new RegExp(
  '^(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|' +
    '세종특별자치시|경기도|강원특별자치도|강원도|충청북도|충청남도|전라북도|전라남도|' +
    '경상북도|경상남도|제주특별자치도|' +
    '서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)\\s+',
);

// 주소 → 지역 라벨. 시·도 접두를 떼고 끝의 번지·도로명 번호 토큰을 버린다
export function toRegion(address: string | null | undefined): string {
  if (!address) return '';
  const tokens = address.replace(SI_DO_PREFIX, '').split(/\s+/).filter(Boolean);
  while (tokens.length && /\d/.test(tokens[tokens.length - 1])) tokens.pop();
  return tokens.join(' ');
}

// 세 점수의 평균 — null인 항목은 0으로 취급
function averageScore(taste: number, value: number, vibe: number): number {
  return Math.round(((taste + value + vibe) / 3) * 10) / 10;
}

interface ToRankEntryParams {
  rating: UserRatingResponse;
  detail: RestaurantDetailResponse | null; // 조회 실패 시 null — 이름만으로 최소 렌더
  visitOrdinal: number; // 로드된 목록 안에서 이 가게 몇 번째 방문인지
}

export function toRankEntry({ rating, detail, visitOrdinal }: ToRankEntryParams): RegionalRankEntry {
  // 백엔드 price·mood ↔ 화면 value·vibe 이름이 다르다
  const scores = {
    taste: rating.taste ?? 0,
    value: rating.price ?? 0,
    vibe: rating.mood ?? 0,
  };

  return {
    // id는 가게 id로 유지한다 — 카드 링크·"수정" 경로가 이 값을 쓴다
    id: String(rating.restaurantId),
    // 같은 가게 재방문 리뷰는 행이 여러 개라 id가 중복된다 — 행 key는 이 값을 쓴다
    ratingId: rating.ratingId,
    name: rating.restaurantName,
    category: toCategory(detail?.category),
    region: toRegion(detail?.address),
    // Fix: 썸네일 필요 — 백엔드 상세 응답에 thumbnailUrl 없음(목록 응답에만 존재)
    imageUrl: '',
    coordinates: { lat: detail?.latitude ?? 0, lng: detail?.longitude ?? 0 },
    rank: 0, // 화면에서 정렬 후 인덱스로 다시 매긴다
    comment: rating.comment ?? '',
    scores,
    avgScore: averageScore(scores.taste, scores.value, scores.vibe),
    visitCount: visitOrdinal,
    // 정렬에서 .getTime()을 직접 부르므로 Date 인스턴스여야 한다
    lastVisitedAt: new Date(rating.createdAt),
    myLatestScene: rating.ratingContextList[0]
      ? ratingContextToSceneTag(rating.ratingContextList[0])
      : undefined,
    myStatus: 'reviewed',
    // 아래 4개는 PlaceListRow variant="my"가 렌더하지 않는다 — 타입 충족용 기본값
    communityAvgScore: detail?.weightedScore ?? 0,
    reviewCount: detail?.ratingCount ?? 0,
    trustScore: detail?.trustScore ?? 0,
    trustBreakdown: detail?.trustBreakdown ?? {
      photoRatio: 0,
      longTextRatio: 0,
      recentActivityRatio: 0,
    },
  };
}

// 한 페이지의 후기들을 행 목록으로 변환 — 같은 가게의 방문 순번을 createdAt 오름차순으로 매긴다
export function toRankEntries(
  ratings: UserRatingResponse[],
  detailById: Map<number, RestaurantDetailResponse | null>,
): RegionalRankEntry[] {
  const ordinalByRestaurant = new Map<number, number>();

  // 오래된 순으로 훑어야 "1번째 방문"이 가장 오래된 리뷰에 붙는다
  const ordered = [...ratings].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const byRatingId = new Map<number, RegionalRankEntry>();
  for (const rating of ordered) {
    const ordinal = (ordinalByRestaurant.get(rating.restaurantId) ?? 0) + 1;
    ordinalByRestaurant.set(rating.restaurantId, ordinal);
    byRatingId.set(
      rating.ratingId,
      toRankEntry({
        rating,
        detail: detailById.get(rating.restaurantId) ?? null,
        visitOrdinal: ordinal,
      }),
    );
  }

  // 원본 응답 순서를 유지해 돌려준다 (정렬은 화면 담당)
  return ratings.map((r) => byRatingId.get(r.ratingId)!).filter(Boolean);
}
