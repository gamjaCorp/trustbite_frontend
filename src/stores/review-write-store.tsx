'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { StoreApi, createStore, useStore } from 'zustand';

import type { Category, Grade, SceneTag } from '@/types/restaurant';

export const LONG_TEXT_THRESHOLD = 100;
export const TRUST_DELTA = {
  consistency: 1.5,
  photo: 2.1,
  longText: 1.4,
} as const;

export type TrustBreakdown = {
  consistency: number;
  photo: number | null;
  longText: number | null;
  total: number;
};

export type ReviewResultSnapshot = {
  restaurantId: string;
  baseTrustScore: number;
  nextTrustScore: number;
  breakdown: TrustBreakdown;
  photoCount: number;
  currentGrade: Grade;
  currentGradeReviewCount: number;
  currentGradeReviewTarget: number;
  nextGradeName: string;
  remainingReviewsForNextGrade: number;
  // TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11)
  // pointsEarned: number;
  // pointReasons: Array<{ label: string; value: number }>;
};

export interface SelectedRestaurant {
  id: string;
  name: string;
  category: Category;
  region: string;
  imageUrl: string;
  subtitle: string;
  visitCount: number;
}

interface ReviewPhoto {
  previewUrl: string;
}

interface ReviewWriteState {
  selectedRestaurant: SelectedRestaurant | null;
  taste: number;
  value: number;
  vibe: number;
  sceneTags: SceneTag[];
  text: string;
  photos: ReviewPhoto[];
}

interface ReviewWriteActions {
  setSelectedRestaurant: (r: SelectedRestaurant) => void;
  clearSelectedRestaurant: () => void;
  setRating: (dim: 'taste' | 'value' | 'vibe', n: number) => void;
  toggleScene: (tag: SceneTag) => void;
  setText: (s: string) => void;
  addPhotos: (urls: string[]) => void;
  removePhoto: (idx: number) => void;
  reset: () => void;
}

type ReviewWriteStore = ReviewWriteState & { action: ReviewWriteActions };

const ReviewWriteContext = createContext<StoreApi<ReviewWriteStore> | null>(null);

const emptyState: Omit<ReviewWriteState, 'selectedRestaurant'> = {
  taste: 0,
  value: 0,
  vibe: 0,
  sceneTags: [],
  text: '',
  photos: [],
};

interface ProviderProps {
  children: ReactNode;
  initialSelectedRestaurant?: SelectedRestaurant | null;
}

export default function ReviewWriteProvider({
  children,
  initialSelectedRestaurant = null,
}: ProviderProps) {
  const [store] = useState(() =>
    createStore<ReviewWriteStore>((set) => ({
      selectedRestaurant: initialSelectedRestaurant,
      ...emptyState,
      action: {
        setSelectedRestaurant: (r) => set({ selectedRestaurant: r }),
        clearSelectedRestaurant: () => set({ selectedRestaurant: null }),
        setRating: (dim, n) => set({ [dim]: n } as Pick<ReviewWriteState, typeof dim>),
        toggleScene: (tag) =>
          set((s) => ({
            sceneTags: s.sceneTags.includes(tag)
              ? s.sceneTags.filter((t) => t !== tag)
              : [...s.sceneTags, tag],
          })),
        setText: (s) => set({ text: s }),
        addPhotos: (urls) =>
          set((s) => ({
            photos: [...s.photos, ...urls.map((previewUrl) => ({ previewUrl }))],
          })),
        removePhoto: (idx) =>
          set((s) => ({ photos: s.photos.filter((_, i) => i !== idx) })),
        reset: () => set({ selectedRestaurant: null, ...emptyState }),
      },
    })),
  );

  return <ReviewWriteContext.Provider value={store}>{children}</ReviewWriteContext.Provider>;
}

const useReviewWriteStore = <T,>(selector: (s: ReviewWriteStore) => T): T => {
  const store = useContext(ReviewWriteContext);
  if (!store) throw new Error('ReviewWriteProvider 내부에서만 사용 가능합니다');
  return useStore(store, selector);
};

export const useSelectedRestaurant = () =>
  useReviewWriteStore((s) => s.selectedRestaurant);
export const useReviewRating = (dim: 'taste' | 'value' | 'vibe') =>
  useReviewWriteStore((s) => s[dim]);
export const useReviewSceneTags = () => useReviewWriteStore((s) => s.sceneTags);
export const useReviewText = () => useReviewWriteStore((s) => s.text);
export const useReviewPhotos = () => useReviewWriteStore((s) => s.photos);
export const useReviewActions = () => useReviewWriteStore((s) => s.action);

export const useReviewAvgScore = () =>
  useReviewWriteStore((s) => {
    if (s.taste === 0 || s.value === 0 || s.vibe === 0) return 0;
    return (s.taste + s.value + s.vibe) / 3;
  });

export const useReviewIsValid = () =>
  useReviewWriteStore(
    (s) =>
      s.selectedRestaurant !== null && s.taste > 0 && s.value > 0 && s.vibe > 0,
  );

export const useReviewTrustDelta = () =>
  useReviewWriteStore((s) => {
    let delta = TRUST_DELTA.consistency;
    if (s.photos.length > 0) delta += TRUST_DELTA.photo;
    if (s.text.length >= LONG_TEXT_THRESHOLD) delta += TRUST_DELTA.longText;
    return delta;
  });

export const useReviewTextLength = () => useReviewWriteStore((s) => s.text.length);
export const useReviewPhotoCount = () => useReviewWriteStore((s) => s.photos.length);
