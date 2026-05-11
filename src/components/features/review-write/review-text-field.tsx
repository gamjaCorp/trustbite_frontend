'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import {
  LONG_TEXT_THRESHOLD,
  TRUST_DELTA,
  useReviewActions,
  useReviewText,
  useReviewTextLength,
} from '@/stores/review-write-store';

export function ReviewTextField() {
  const text = useReviewText();
  const length = useReviewTextLength();
  const { setText } = useReviewActions();
  const reached = length >= LONG_TEXT_THRESHOLD;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-caption-2 text-muted-foreground">
          <span className="font-numeric">{length}</span>자
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-caption-2 transition-colors',
            reached ? 'text-primary font-semibold' : 'text-muted-foreground',
          )}
        >
          {reached && <Check className="w-3.5 h-3.5" />}
          <span className="font-numeric">{LONG_TEXT_THRESHOLD}</span>자 돌파 +
          <span className="font-numeric">{TRUST_DELTA.longText}</span>%
        </span>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="이 가게에서 어떤 경험을 했는지 알려주세요. 100자 이상 작성하면 신뢰도가 더 올라가요."
        className="min-h-32 resize-none rounded-xl bg-card ring-1 ring-paper-edge/40 border-0 shadow-none focus-visible:ring-primary/40"
      />
    </div>
  );
}
