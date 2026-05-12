import Link from 'next/link';
import { Star } from 'lucide-react';
import { RealtimeReview } from '@/types/restaurant';
import { GradeBadge } from '@/components/core/grade-badge';

interface Props {
  reviews: RealtimeReview[];
}

function StarRow({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < score ? 'fill-palette-amber text-palette-amber' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export function RealtimeReviews({ reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <section className="space-y-3 pt-6">
      <h2 className="text-headline-3 text-foreground flex items-center gap-2">실시간 평가</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide py-3 -my-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="w-52 shrink-0 bg-card rounded-2xl shadow-card p-4 flex flex-col gap-2"
          >
            {/* 식당명 + 시간 */}
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/restaurant/${review.restaurantId}`}
                className="text-title-2 truncate hover:text-primary transition-colors"
              >
                {review.restaurantName}
              </Link>
              <span className="text-label-3 text-muted-foreground shrink-0 bg-muted/60 rounded-chip px-1.5 py-0.5">
                {review.minutesAgo}분 전
              </span>
            </div>

            {/* 별점 + 리뷰어 */}
            <div className="flex items-center justify-between gap-2">
              <StarRow score={review.score} />
              <div className="flex items-center gap-1 min-w-0">
                <Link
                  href={`/user/${review.reviewerId}`}
                  className="text-caption-2 text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  {review.reviewerName}
                </Link>
                <GradeBadge grade={review.reviewerGrade} size="sm" showLabel={false} />
              </div>
            </div>

            {/* 리뷰어 신뢰도 · 방문 */}
            <p className="text-caption-2 text-muted-foreground">
              신뢰도 {review.reviewerTrustScore}% · 방문 {review.reviewerVisitCount}회
            </p>

            {/* 코멘트 */}
            <p className="text-body-2 text-muted-foreground leading-relaxed line-clamp-2">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
