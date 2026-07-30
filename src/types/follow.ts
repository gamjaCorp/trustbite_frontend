export type FollowTabKey = 'followers' | 'following';

// 팔로워/팔로잉 목록 한 행에 필요한 유저 정보
export type FollowedUser = {
  userId: number;
  nickname: string;
  picture: string | null;
  grade: string;
  following: boolean;
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시로 number 사용
  // trustScore: number;
  // description: 사용자 설명 필요
};
