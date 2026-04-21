export type Category = '한식' | '일식' | '중식' | '양식' | '카페' | '술집' | '기타';

export interface TopRestaurant {
  rank: 1 | 2 | 3;
  name: string;
  myRating: number; // 1~5
}

export interface RegionCount {
  region: string;
  count: number;
}

export interface MyRestaurantStats {
  visitCount: number;
  reviewCount: number;
  trustScore: number; // 0~100
  topRestaurants: TopRestaurant[];
  regionCounts: RegionCount[];
  topCategory: Category | null;
}

export interface RatingScores {
  taste: number;  // 맛 (1~5)
  value: number;  // 가성비 (1~5)
  vibe: number;   // 분위기 (1~5)
}

export interface Coordinates {
  lat: number;
  lng: number;
}

interface RestaurantBase {
  id: string;
  name: string;
  category: Category;
  region: string;
  imageUrl: string;
  coordinates: Coordinates;
}

/** 나의 맛집 탭 — 내가 기록한 데이터 */
export type MyRestaurantEntry = RestaurantBase & {
  rank: number;
  comment: string;
  scores: RatingScores;
  avgScore: number;
  visitCount: number;
  lastVisitedAt: Date;
};

export type VisitStatus = 'none' | 'visited' | 'reviewed';

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

/** 가게 단위 신뢰도 구성 요소 (0~1 비율) */
export interface TrustBreakdown {
  photoRatio: number;
  longTextRatio: number;
  recentActivityRatio: number;
}

/** 지역 랭킹 탭 — 커뮤니티 데이터 + 방문 상태 포함 (필수) */
export type RegionalRankEntry = MyRestaurantEntry & {
  communityAvgScore: number;
  reviewCount: number;
  myStatus: VisitStatus;
  trustScore: number;
  trustBreakdown: TrustBreakdown;
};

export type SortKey = 'score' | 'recent';

export interface RealtimeReview {
  id: string;
  restaurantId: string;
  restaurantName: string;
  reviewerName: string;
  reviewerGrade: Grade;
  reviewerTrustScore: number;
  reviewerVisitCount: number;
  score: number;
  comment: string;
  minutesAgo: number;
}
