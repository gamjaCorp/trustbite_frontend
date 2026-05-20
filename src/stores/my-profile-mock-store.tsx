// TODO: 1차 MVP 제외 — 백엔드 프로필 API 연동 시 제거
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MyProfileMockState = {
  nickname: string;
  setNickname: (v: string) => void;
};

export const useMyProfileMock = create<MyProfileMockState>()(
  persist(
    (set) => ({
      nickname: '감자먹은 햄찌',
      setNickname: (v) => set({ nickname: v.trim() }),
    }),
    { name: 'tb-my-profile-mock' },
  ),
);
