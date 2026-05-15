// TODO: 1차 MVP 제외 — NextAuth 세션 연결 시 제거
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthMockState = {
  isAuthed: boolean;
  setAuthed: (v: boolean) => void;
  toggle: () => void;
};

export const useAuthMock = create<AuthMockState>()(
  persist(
    (set) => ({
      isAuthed: false,
      setAuthed: (v) => set({ isAuthed: v }),
      toggle: () => set((s) => ({ isAuthed: !s.isAuthed })),
    }),
    { name: 'tb-auth-mock' },
  ),
);
