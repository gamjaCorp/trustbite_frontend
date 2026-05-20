import type { GradeLevel } from '@/lib/grade-levels';

export type FollowTabKey = 'followers' | 'following';

// 팔로워/팔로잉 목록 한 행에 필요한 유저 정보
export interface FollowedUser {
  id: string;
  name: string;
  handle: string;
  avatarInitial: string;
  level: GradeLevel;
  trustScore: number;
  bio?: string;
  followsMeBack?: boolean;
}
