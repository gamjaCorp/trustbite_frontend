'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { StoreApi, createStore, useStore } from 'zustand';

import type { Category, SceneTag } from '@/types/restaurant';

import { reviewSchema } from '@/components/features/review-write/schema';
import { computeTrustBreakdown, TrustBreakdown } from '@/lib/domain/trust-delta';

export interface ReviewDraft {
  taste: number;
  value: number;
  vibe: number;
  sceneTags: SceneTag[];
  text: string;
  photos: { previewUrl: string }[];
}

export type ReviewResultSnapshot = {
  restaurantId: string;
  baseTrustScore: number;
  nextTrustScore: number;
  breakdown: TrustBreakdown;
  photoCount: number;
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시로 number 사용
  currentLevel: number;
  currentGradeReviewCount: number;
  currentGradeReviewTarget: number;
  nextGradeName: string;
  remainingReviewsForNextGrade: number;
  // TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11)
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
  isEditMode: boolean;
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

const emptyState: Omit<ReviewWriteState, 'selectedRestaurant' | 'isEditMode'> = {
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
  initialDraft?: ReviewDraft | null;
}

export default function ReviewWriteProvider({
  children,
  initialSelectedRestaurant = null,
  initialDraft = null,
}: ProviderProps) {
  const [store] = useState(() =>
    createStore<ReviewWriteStore>((set) => ({
      selectedRestaurant: initialSelectedRestaurant,
      ...(initialDraft ?? emptyState),
      isEditMode: initialDraft != null,
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
        removePhoto: (idx) => set((s) => ({ photos: s.photos.filter((_, i) => i !== idx) })),
        reset: () => set({ selectedRestaurant: null, isEditMode: false, ...emptyState }),
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

export const useSelectedRestaurant = () => useReviewWriteStore((s) => s.selectedRestaurant);
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
      reviewSchema.safeParse({
        restaurantId: s.selectedRestaurant?.id ?? '',
        taste: s.taste,
        value: s.value,
        vibe: s.vibe,
        text: s.text,
        photos: s.photos,
      }).success,
  );

export const useReviewTrustDelta = () =>
  useReviewWriteStore((s) => {
    return computeTrustBreakdown({ photoCount: s.photos.length, textLength: s.text.length }).total;
  });

export const useReviewTextLength = () => useReviewWriteStore((s) => s.text.length);
export const useReviewPhotoCount = () => useReviewWriteStore((s) => s.photos.length);
export const useReviewIsEditMode = () => useReviewWriteStore((s) => s.isEditMode);
