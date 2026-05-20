'use client';

import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { CategoryBadge } from '@/components/common/category-badge';
import { useReviewActions, useSelectedRestaurant } from '@/stores/review-write-store';

export function TargetRestaurantCard() {
  const selected = useSelectedRestaurant();
  const { clearSelectedRestaurant } = useReviewActions();

  if (!selected) return null;

  const visitOrdinal = selected.visitCount + 1;

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card ring-1 ring-border p-3 shadow-card">
      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image src={selected.imageUrl} alt={selected.name} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-title-2 text-foreground truncate">{selected.name}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <CategoryBadge category={selected.category} />
          <span className="text-caption-2 text-muted-foreground truncate">{selected.subtitle}</span>
        </div>
      </div>

      <span className="shrink-0 rounded-chip bg-primary-subtle px-2.5 py-1 text-label-3 text-primary">
        <span className="">{visitOrdinal}</span>번째 방문
      </span>

      <button
        type="button"
        onClick={clearSelectedRestaurant}
        aria-label="음식점 다시 선택"
        className="shrink-0 w-8 h-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
}
