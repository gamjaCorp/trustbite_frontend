// TODO: 1차 MVP 제외 — 백엔드 helpful vote API 연결 시 제거
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type HelpfulMockState = {
  helpfulIds: string[];
  toggle: (id: string) => void;
  isHelpful: (id: string) => boolean;
};

export const useHelpfulMock = create<HelpfulMockState>()(
  persist(
    (set, get) => ({
      helpfulIds: [],
      toggle: (id) =>
        set((s) => ({
          helpfulIds: s.helpfulIds.includes(id)
            ? s.helpfulIds.filter((x) => x !== id)
            : [...s.helpfulIds, id],
        })),
      isHelpful: (id) => get().helpfulIds.includes(id),
    }),
    { name: 'tb-helpful-mock' },
  ),
);
