import type { MyRestaurantEntry } from './restaurant';
import type { GradeLevel } from '@/lib/grade-levels';

export interface MutualFollowing {
  displayName: string;
  extraCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  gradeName: string;
  curatedCount: number;
  followerCount: number;
  followingCount: number;
  mutualFollowing?: MutualFollowing;
  visitCount: number;
  reviewCount: number;
  trustScore: number;
  aiTastePersona: string;
  rankings: MyRestaurantEntry[];
  totalRankCount: number;
}

export interface MyProfile {
  id: string;
  name: string;
  avatarInitial: string;
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
