'use client';

import { Pencil } from 'lucide-react';
import { Surface } from '@/components/common/display/surface';
import { RestaurantIdentityRow } from '@/components/common/restaurant/restaurant-identity-row';
import { RestaurantThumbnail } from '@/components/common/restaurant/restaurant-thumbnail';
import { useReviewActions, useSelectedRestaurant } from '../stores/review-write-store';

// 리뷰 작성 대상 음식점 선택 카드
export function TargetRestaurantCard() {
  const selected = useSelectedRestaurant();
  const { clearSelectedRestaurant } = useReviewActions();

  if (!selected) return null;

  const visitOrdinal = selected.visitCount + 1;

  return (
    <Surface variant="card" padding="sm" className="flex items-center gap-3">
      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-muted">
        <RestaurantThumbnail
          src={selected.imageUrl}
          alt={selected.name}
          category={selected.category}
          className="absolute inset-0"
        />
      </div>

      <RestaurantIdentityRow
        name={selected.name}
        category={selected.category}
        subtitle={selected.subtitle}
        className="flex-1"
      />

      <span className="shrink-0 rounded-chip bg-primary-subtle px-2.5 py-1 text-label-3 text-primary">
        {visitOrdinal}번째 방문
      </span>

      <button
        type="button"
        onClick={clearSelectedRestaurant}
        aria-label="음식점 다시 선택"
        className="shrink-0 w-11 h-11 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </button>
    </Surface>
  );
}
