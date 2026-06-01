import Link from 'next/link';
import { ThumbsUp } from 'lucide-react';
import { DetailedReview } from '@/types/restaurant';
import { UserGradeMark } from '@/components/common/user-grade-mark';
import { DimensionScoreRow } from './dimension-score-row';
import { VisitOrdinalChip } from './visit-ordinal-chip';
import { ReviewBodyClamp } from './review-body-clamp';
import { ReviewPhotoGrid } from './review-photo-grid';
import { SceneTagsRow } from './scene-tags-row';

interface Props {
  review: DetailedReview;
}

export function ReviewCard({ review }: Props) {
  return (
    <article className="px-6 py-4 border-t border-border first:border-t-0">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Link
            href={`/user/${review.reviewerId}`}
            className="shrink-0 w-10 h-10 rounded-full bg-primary-subtle text-primary font-bold flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {review.reviewerInitial}
          </Link>
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-1.5">
              <Link
                href={`/user/${review.reviewerId}`}
                className="text-title-2 text-foreground hover:text-primary transition-colors"
              >
                {review.reviewerName}
              </Link>
              <UserGradeMark level={review.reviewerLevel} size="sm" />
              <VisitOrdinalChip ordinal={review.visitOrdinal} />
            </div>
            <p className="mt-0.5 text-caption-2 text-muted-foreground">
              신뢰도 {review.reviewerTrustScore}%
            </p>
          </div>
        </div>
        <span className="shrink-0 text-caption-2 text-muted-foreground">{review.postedAt}</span>
      </header>

      <DimensionScoreRow scores={review.scores} className="mt-2.5" />

      <div className="mt-2.5">
        <ReviewBodyClamp content={review.content} />
      </div>

      <ReviewPhotoGrid photos={review.photos ?? []} />

      <div className="mt-3 flex items-end justify-between gap-3">
        <SceneTagsRow tags={review.sceneTags} />

        {/* TODO: 1차 MVP 제외 — 도움됐어요 (커뮤니티 평판 2차 MVP) */}
        <div
          aria-disabled="true"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-label-3 opacity-35 cursor-not-allowed"
        >
          <ThumbsUp className="w-3 h-3" />
          도움됐어요 <span>{review.helpfulCount}</span>
        </div>
      </div>
    </article>
  );
}
