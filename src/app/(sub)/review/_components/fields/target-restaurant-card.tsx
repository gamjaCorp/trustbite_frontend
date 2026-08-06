'use client';

import { Pencil } from 'lucide-react';
import { IconButton } from '@/components/core/icon-button';
import { Surface } from '@/components/common/display/surface';
import { RestaurantIdentityRow } from '@/components/common/restaurant/restaurant-identity-row';
import { RestaurantThumbnail } from '@/components/common/restaurant/restaurant-thumbnail';
import { useReviewActions, useSelectedRestaurant } from '../../_lib/review-write-store';

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

      <IconButton
        icon={Pencil}
        onClick={clearSelectedRestaurant}
        aria-label="음식점 다시 선택"
        variant="ghost"
        className="text-muted-foreground"
      />
    </Surface>
  );
}
