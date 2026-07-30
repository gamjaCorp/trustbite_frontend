import type { RegionalRankEntry } from './restaurant';

export interface MyProfileResponse {
  userId: number;
  email: string;
  nickname: string;
  picture: string | null;
  grade: string;
  trustScore: number;
  reviewCount: number;
  nextGrade: string;
  needCount: number;
  needScore: number;
  createdAt: string;
  followerCount: number;
  followingCount: number;
}

export interface MutualFollowing {
  displayName: string;
  extraCount: number;
}

export interface MockUserProfile {
  id: string;
  name: string;
  handle: string;
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시로 number 사용
  level: number;
  gradeName: string;
  curatedCount: number;
  followerCount: number;
  followingCount: number;
  mutualFollowing?: MutualFollowing;
  visitCount: number;
  reviewCount: number;
  trustScore: number;
  aiTastePersona: string;
  rankings: RegionalRankEntry[];
  totalRankCount: number;
}

export type UserProfile = {
  userId: number;
  nickname: string;
  picture: string;
  grade: string;
  trustScore: number;
  reviewCount: number;
  followerCount: number;
  followingCount: number;
};
