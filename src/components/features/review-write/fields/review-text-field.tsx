'use client';

import { Textarea } from '@/components/ui/textarea';
import { useReviewActions, useReviewText } from '../stores/review-write-store';

// 리뷰 내용 자유 입력 텍스트 필드
export function ReviewTextField() {
  const text = useReviewText();
  const { setText } = useReviewActions();

  return (
    <div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="리뷰 내용"
        placeholder="이 가게에서 어떤 경험을 했는지 알려주세요. 100자 이상 작성하면 신뢰도가 더 올라가요."
        className="min-h-32 resize-none rounded-xl bg-card ring-1 ring-border border-0 shadow-none focus-visible:ring-primary/40 px-4 py-3"
      />
    </div>
  );
}
