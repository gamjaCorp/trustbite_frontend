import Link from 'next/link';
import { ThumbsUp } from 'lucide-react';
import { DetailedReview } from '@/types/restaurant';
import { UserGradeMark } from '@/components/common/trust/user-grade-mark';
import { UserAvatar } from '@/components/core/user-avatar';
import { DimensionScoreRow } from './dimension-score-row';
import { VisitOrdinalChip } from './visit-ordinal-chip';
import { ReviewBodyClamp } from './review-body-clamp';
import { ReviewPhotoGrid } from './review-photo-grid';
import { SceneTagsRow } from './scene-tags-row';

interface Props {
  review: DetailedReview;
}

// 리뷰 카드 — 유저 아바타·점수·태그·본문·사진을 한 카드에 표시
export function ReviewCard({ review }: Props) {
  return (
    <article className="px-6 py-4 border-t border-border first:border-t-0">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Link
            href={`/user/${review.reviewerId}`}
            className="shrink-0 hover:opacity-90 transition-opacity"
          >
            <UserAvatar initial={review.reviewerInitial} size="md" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-1.5">
              <Link
                href={`/user/${review.reviewerId}`}
                className="text-title-2 text-foreground hover:text-primary transition-colors"
              >
                {review.reviewerName}
              </Link>
              {/* Fix: 등급 이름 필요 — 백엔드 grade 응답 필요, 임시 고정값 */}
              <UserGradeMark name="COLLECTOR" size="sm" />
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
          className="shrink-0 inline-flex items-center gap-1.5 rounded-chip border border-border px-3 py-1 text-label-3 opacity-35 cursor-not-allowed"
        >
          <ThumbsUp className="w-3 h-3" />
          도움됐어요 <span>{review.helpfulCount}</span>
        </div>
      </div>
    </article>
  );
}
