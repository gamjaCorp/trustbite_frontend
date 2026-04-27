import type { MyRestaurantEntry } from './restaurant';

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
