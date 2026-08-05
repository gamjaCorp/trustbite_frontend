// 이용 유형(상황 태그) — 정의는 lib/domain/scene-tag.ts 하나로 모았다. 기존 import 경로 유지를 위한 재수출
export type { RatingContext } from '@/lib/domain/scene-tag';
import type { RatingContext } from '@/lib/domain/scene-tag';

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

// 유저가 쓴 후기 1건 — GET /api/ratings/user/{userId} 응답 항목
// 가게 정보는 id·이름만 온다 (카테고리·주소·좌표는 /api/restaurants/{id}로 별도 조회)
export type UserRatingResponse = {
  restaurantId: number;
  restaurantName: string;
  ratingId: number;
  taste: number | null; // 엔티티에 nullable=false가 없어 null 가능
  price: number | null;
  mood: number | null;
  revisit: boolean; // Java primitive — 항상 값 있음
  ratingContextList: RatingContext[];
  locationVerified: boolean; // Java primitive — 항상 값 있음
  comment: string | null;
  photoUrls: string[];
  createdAt: string; // 타임존 없는 LocalDateTime 문자열
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
