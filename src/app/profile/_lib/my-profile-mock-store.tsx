// TODO: 1차 MVP 제외 — 백엔드 프로필 API 연동 시 제거
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MyProfileMockState = {
  nickname: string;
  avatarUrl?: string;
  setNickname: (v: string) => void;
  setAvatarUrl: (v: string | undefined) => void;
};

export const useMyProfileMock = create<MyProfileMockState>()(
  persist(
    (set) => ({
      nickname: '감자먹은 햄찌',
      avatarUrl: undefined,
      setNickname: (v) => set({ nickname: v.trim() }),
      setAvatarUrl: (v) => set({ avatarUrl: v }),
    }),
    { name: 'tb-my-profile-mock' },
  ),
);
