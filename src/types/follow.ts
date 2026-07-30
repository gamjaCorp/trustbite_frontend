export type FollowTabKey = 'followers' | 'following';

// 팔로워/팔로잉 목록 한 행에 필요한 유저 정보
export interface FollowedUser {
  id: string;
  name: string;
  handle: string;
  avatarInitial: string;
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시로 number 사용
  level: number;
  trustScore: number;
  bio?: string;
  followsMeBack?: boolean;
}
