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
    <div className="flex items-center justify-between rounded-xl bg-card ring-1 ring-paper-edge/40 px-4 py-3">
      <span className="text-title-3 text-foreground">{label}</span>
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
