// 이용 유형(상황 태그) — 백엔드 RatingContext enum 그대로
export type RatingContext = 'DATE' | 'FAMILY' | 'ALONE' | 'FRIEND' | 'COMPANY';

export type RatingRequest = {
  apiPlaceId: number;
  address: string;
  name: string;
  latitude: number;
  longitude: number;
  taste: number;
  price: number;
  mood: number;
  revisit: boolean;
  ratingContextList: RatingContext[];
  locationVerified: boolean;
  comment: string;
  photoUrls: string[];
};

export type RatingResponse = {
  ratingId: number;
  trustScore: number | null;
  grade: string;
  reviewCount: number;
  nextGrade: string | null;
  needRatingCount: number | null;
  needTrustScore: number | null;
  needCount: number | null;
  needScore: number | null;
};
