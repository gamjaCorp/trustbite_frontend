import type { GradeLevel } from '@/lib/domain/grade-levels';

export type Category = '한식' | '일식' | '중식' | '양식' | '분식' | '치킨' | '패스트푸드' | '카페' | '술집' | '기타';

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
  myLatestScene?: SceneTag;
};

export type VisitStatus = 'none' | 'visited' | 'reviewed';


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
  // TODO: 1차 MVP 제외 — Kakao 원본 세부 카테고리. 백엔드 도착 시 별도 필드로 교체 가능
  subCategory?: string;
  // TODO: 1차 MVP 제외 — mock 상세 데이터가 있는 경우 true. 백엔드 도착 시 항상 true로 처리
  hasRealData?: boolean;
  // TODO: 1차 MVP 제외 — Kakao 원본 메타. 백엔드 도착 시 삭제
  phone?: string;
  roadAddress?: string;
  placeUrl?: string;
  categoryGroupName?: string;
  categoryPath?: string;
};

export type SortKey = 'score' | 'recent';

export interface RealtimeReview {
  id: string;
  restaurantId: string;
  restaurantName: string;
  reviewerId: string;
  reviewerName: string;
  reviewerLevel: GradeLevel;
  reviewerTrustScore: number;
  reviewerVisitCount: number;
  score: number;
  comment: string;
  minutesAgo: number;
}

/* ── 상세 페이지용 타입 ── */

export type SceneTag = '데이트' | '회식' | '혼밥' | '다이어트';

export interface OpeningHours {
  weekday: string;
}

export interface SceneScore {
  tag: SceneTag;
  score: number;
}

export interface DetailedReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerInitial: string;
  reviewerLevel: GradeLevel;
  reviewerTrustScore: number;
  visitOrdinal: number;
  scores: RatingScores;
  content: string;
  photos?: string[];
  sceneTags: SceneTag[];
  helpfulCount: number;
  postedAt: string;
}

export interface RepeatVisitEntry {
  label: string;
  scores: RatingScores;
  content: string;
}

export interface MyReviewEntry {
  visitOrdinal: number;
  dateLabel: string;
  scores: RatingScores;
  content: string;
  sceneTags: SceneTag[];
  photos?: string[];
}

export interface MyReview {
  visitCount: number;
  lastVisitLabel: string;
  visits: MyReviewEntry[];
}

export interface RepeatVisitReview {
  reviewerId: string;
  reviewerName: string;
  reviewerInitial: string;
  reviewerLevel: GradeLevel;
  reviewerTrustScore: number;
  visitCount: number;
  visits: RepeatVisitEntry[];
}

export interface RestaurantDetail {
  id: string;
  name: string;
  category: Category;
  subCategory?: string;
  region: string;
  tagline?: string;
  address: string;
  accessSummary: string;
  hours: OpeningHours;
  coordinates: Coordinates;
  photos: string[];
  totalPhotoCount: number;
  locationDescription: string;
  communityAvgScore: number;
  dimensionScores: RatingScores;
  sceneScores: SceneScore[];
  trustScore: number;
  trustBreakdown: TrustBreakdown;
  reviewCount: number;
  myReview?: MyReview;
  repeatVisitReview?: RepeatVisitReview;
  reviews: DetailedReview[];
  // TODO: 1차 MVP 제외 — Kakao 원본 메타. 백엔드 도착 시 교체
  phone?: string;
  roadAddress?: string;
  buildingName?: string;
  placeUrl?: string;
  categoryGroupName?: string;
  categoryPath?: string;
  administrativeArea?: string;
  nearestStation?: { name: string; walkMinutes: number };
}
