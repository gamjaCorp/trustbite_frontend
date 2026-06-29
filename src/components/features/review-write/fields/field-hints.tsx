'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReviewPhotoCount, useReviewTextLength } from '@/stores/review-write-store';
import { LONG_TEXT_THRESHOLD, TRUST_DELTA } from '@/lib/domain/trust-delta';

// 리뷰 100자 돌파 힌트 — FieldGroup hint 슬롯에 배치
export function ReviewHint() {
  const length = useReviewTextLength();
  const reached = length >= LONG_TEXT_THRESHOLD;
  if (!reached) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-primary font-semibold">
      <Check className="w-3 h-3" />
      {LONG_TEXT_THRESHOLD}자 돌파 +{TRUST_DELTA.longText}%
    </span>
  );
}

// 리뷰 글자수 카운터 — FieldGroup labelRight 슬롯에 배치
export function ReviewCharCount() {
  const length = useReviewTextLength();
  return <span>{length}자</span>;
}

// 사진 첨부 힌트 — FieldGroup hint 슬롯에 배치
export function PhotoHint() {
  const count = useReviewPhotoCount();
  const reached = count > 0;
  return (
    <span
      className={cn(
        'flex items-center gap-0.5 transition-colors',
        reached ? 'text-primary font-semibold' : '',
      )}
    >
      {reached && <Check className="w-3 h-3" />}
      사진 첨부 +{TRUST_DELTA.photo}%
    </span>
  );
}
