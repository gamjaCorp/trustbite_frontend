import type { MyProfile } from '@/types/user';

const myProfile: MyProfile = {
  id: 'hamzee',
  name: '감자먹은 햄찌',
  avatarInitial: '햄',
  email: 'hamzee@gmail.com',
  joinedAt: '2026.02 가입',
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시 mock 고정값
  level: 3,
  followerCount: 142,
  followingCount: 38,
  reviewCount: 11,
  trustScore: 77,
  trustScoreThreshold: 60,
  trustScoreMet: true,
  points: 82,
  recentPointDelta: 8,
  recentPointReason: '리뷰 1개',
  sharedListCount: 3,
  sharedListPreview: ['팀 회식', '데이트 코스'],
  sharedListExtraCount: 1,
  myReviewCount: 11,
  unlockedGuideUserCount: 5,
  unlockedGuideTier: 3,
  helpfulVoteTier: 2,
  activityRegion: '서울 강남구',
};

export function getMyProfile(): MyProfile {
  return myProfile;
}
