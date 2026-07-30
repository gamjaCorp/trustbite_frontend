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

interface MutualFollowing {
  displayName: string;
  extraCount: number;
}

export interface UserProfile {
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

export interface MyProfile {
  id: string;
  name: string;
  avatarInitial: string;
  avatarUrl?: string;
  email: string;
  joinedAt: string;
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시로 number 사용
  level: number;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  trustScore: number;
  trustScoreThreshold: number;
  trustScoreMet: boolean;
  points: number;
  recentPointDelta: number;
  recentPointReason: string;
  sharedListCount: number;
  sharedListPreview: string[];
  sharedListExtraCount: number;
  myReviewCount: number;
  unlockedGuideUserCount: number;
  unlockedGuideTier: number;
  helpfulVoteTier: number;
  activityRegion: string;
}
