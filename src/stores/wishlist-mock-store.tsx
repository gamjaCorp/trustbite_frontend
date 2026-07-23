// TODO: 1차 MVP 제외 — 백엔드 wishlist API 연결 시 제거
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialWishlistSeed } from '@/data/mock-wishlist';

type WishlistItem = { restaurantId: string; addedAt: string };

type WishlistMockState = {
  items: WishlistItem[];
  isBookmarked: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
};

export const useWishlistMock = create<WishlistMockState>()(
  persist(
    (set, get) => ({
      items: [...initialWishlistSeed],
      isBookmarked: (id) => get().items.some((item) => item.restaurantId === id),
      toggle: (id) =>
        set((s) => {
          const exists = s.items.some((item) => item.restaurantId === id);
          return {
            items: exists
              ? s.items.filter((item) => item.restaurantId !== id)
              : [...s.items, { restaurantId: id, addedAt: new Date().toISOString() }],
          };
        }),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((item) => item.restaurantId !== id) })),
    }),
    { name: 'tb-wishlist-mock' },
  ),
);
