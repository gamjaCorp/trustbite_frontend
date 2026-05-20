// TODO: 1차 MVP 제외 — 백엔드 follow API 연동 시 제거 (W11 / 3차 MVP)
import type { GradeLevel } from '@/lib/grade-levels';
import type { FollowedUser } from '@/types/follow';

const allUsers: FollowedUser[] = [
  {
    id: 'hamzee',
    name: '감자먹은 햄찌',
    handle: 'hamzee',
    avatarInitial: '햄',
    level: 3 as GradeLevel,
    trustScore: 77,
    bio: '서울 강남구 맛집 탐방 중',
    followsMeBack: true,
  },
  {
    id: 'minseo',
    name: '민서',
    handle: 'minseo_eats',
    avatarInitial: '민',
    level: 4 as GradeLevel,
    trustScore: 85,
    bio: '을지로 골목 탐험 중',
    followsMeBack: true,
  },
  {
    id: 'jiyeon',
    name: '지연',
    handle: 'jiyeon_kitchen',
    avatarInitial: '지',
    level: 3 as GradeLevel,
    trustScore: 72,
    bio: '요리하고 먹고 또 요리하는 사람',
    followsMeBack: false,
  },
  {
    id: 'taehoon',
    name: '태훈',
    handle: 'taehoon_nom',
    avatarInitial: '태',
    level: 2 as GradeLevel,
    trustScore: 61,
    bio: '홍대·마포 구석구석',
    followsMeBack: false,
  },
  {
    id: 'sooyeon',
    name: '수연',
    handle: 'sooyeon_fork',
    avatarInitial: '수',
    level: 5 as GradeLevel,
    trustScore: 92,
    bio: '미식 취향은 진지하게',
    followsMeBack: true,
  },
  {
    id: 'jongmin',
    name: '종민',
    handle: 'jongmin_taste',
    avatarInitial: '종',
    level: 3 as GradeLevel,
    trustScore: 68,
    followsMeBack: false,
  },
];

const byId = (id: string) => allUsers.find((u) => u.id === id)!;

const followData: Record<string, { followers: FollowedUser[]; following: FollowedUser[] }> = {
  hamzee: {
    followers: ['minseo', 'sooyeon', 'jiyeon', 'taehoon', 'jongmin'].map(byId),
    following: ['minseo', 'sooyeon'].map(byId),
  },
  minseo: {
    followers: ['hamzee', 'sooyeon', 'taehoon'].map(byId),
    following: ['hamzee', 'jiyeon', 'sooyeon', 'jongmin'].map(byId),
  },
  'empty-user': {
    followers: [],
    following: [],
  },
};

export function getFollowers(userId: string): FollowedUser[] {
  return followData[userId]?.followers ?? [];
}

export function getFollowing(userId: string): FollowedUser[] {
  return followData[userId]?.following ?? [];
}

export function getInitialFollowingIds(userId: string): string[] {
  return getFollowing(userId).map((u) => u.id);
}
