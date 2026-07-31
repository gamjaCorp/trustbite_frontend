// TODO: 1차 MVP 제외 — 백엔드 follow API 연동 시 제거 (W11 / 3차 MVP)
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FollowMockState = {
  followingIds: number[];
  isFollowing: (userId: number) => boolean;
  toggle: (userId: number) => void;
};

export const useFollowMock = create<FollowMockState>()(
  persist(
    (set, get) => ({
      followingIds: [],
      isFollowing: (userId) => get().followingIds.includes(userId),
      toggle: (userId) =>
        set((s) => ({
          followingIds: s.followingIds.includes(userId)
            ? s.followingIds.filter((id) => id !== userId)
            : [...s.followingIds, userId],
        })),
    }),
    { name: 'tb-follow-mock' },
  ),
);
