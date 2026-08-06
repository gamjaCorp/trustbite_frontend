'use client';

import { ChevronDown } from 'lucide-react';

import type { DetailedReview } from '@/types/restaurant';
import { LoginCtaDialog } from '@/components/common/login-cta-dialog';
import { useAuthGatedAction } from '@/hooks/use-auth-gated-action';

import { Button } from '@/components/ui/button';
import { ReviewCard } from './review-card';

interface Props {
  reviews: DetailedReview[];
  othersReviewCount: number;
  restaurantId: string;
}

// 인증 상태에 따라 리뷰 노출 개수와 '더 보기' CTA 동작을 분기
export function LoggedOutReviewGate({ reviews, othersReviewCount, restaurantId }: Props) {
  const { trigger, dialogProps, isAuthed } = useAuthGatedAction({
    action: () => {},
    callbackPath: `/restaurant/${restaurantId}`,
  });

  const visibleReviews = isAuthed ? reviews.slice(0, 5) : reviews.slice(0, 2);
  const remainingReviews = Math.max(0, othersReviewCount - visibleReviews.length);

  return (
    <>
      <div className="mt-2">
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {remainingReviews > 0 && (
        <div className="px-6 pt-4">
          <Button type="button" variant="outline" onClick={trigger} className="w-full gap-1.5">
            리뷰 <span className="">{remainingReviews}</span>개 더 보기
            {isAuthed && <ChevronDown className="w-4 h-4" />}
          </Button>
          <p className="mt-2 text-center text-caption-2 text-muted-foreground">
            {visibleReviews.length} / {othersReviewCount}개 표시 중 · 신뢰도순
          </p>
        </div>
      )}

      <LoginCtaDialog {...dialogProps} />
    </>
  );
}
