'use client';

import { StarRatingInput } from './star-rating-input';
import { useReviewActions, useReviewRating } from '@/stores/review-write-store';

const DIMENSIONS: Array<{ key: 'taste' | 'value' | 'vibe'; label: string }> = [
  { key: 'taste', label: '맛' },
  { key: 'value', label: '가성비' },
  { key: 'vibe', label: '분위기' },
];

function RatingRow({ dim, label }: { dim: 'taste' | 'value' | 'vibe'; label: string }) {
  const value = useReviewRating(dim);
  const { setRating } = useReviewActions();

  return (
    <div className="flex items-center justify-between rounded-xl bg-card ring-1 ring-border px-4 py-3">
      <span className="flex items-baseline gap-1.5">
        <span className="text-title-2 text-foreground">{label}</span>
        {value > 0 && (
          <span className="text-caption-1 text-primary font-semibold">{value.toFixed(1)}점</span>
        )}
      </span>
      <StarRatingInput
        value={value}
        onChange={(n) => setRating(dim, n)}
        ariaLabel={`${label} 별점`}
      />
    </div>
  );
}

export function RatingFields() {
  return (
    <div className="space-y-2">
      {DIMENSIONS.map(({ key, label }) => (
        <RatingRow key={key} dim={key} label={label} />
      ))}
    </div>
  );
}
