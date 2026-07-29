import type { RegionalRankEntry } from './restaurant';
import type { GradeLevel, GradeName } from '@/lib/domain/grade-levels';

export interface MyProfileResponse {
  userId: number;
  email: string;
  nickname: string;
  picture: string | null;
  grade: GradeName;
  trustScore: number;
  reviewCount: number;
  nextGrade: GradeName;
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
  level: GradeLevel;
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
  level: GradeLevel;
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
