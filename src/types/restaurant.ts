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

export interface RestaurantRankEntry {
  id: string;
  rank: number;
  name: string;
  category: Category;
  region: string;
  imageUrl: string;
  comment: string;
  scores: RatingScores;
  avgScore: number;
  visitCount: number;
  lastVisitedAt: Date;
}

export type SortKey = 'score' | 'recent';
