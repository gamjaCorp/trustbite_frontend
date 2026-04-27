import { notFound } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { getRestaurantDetail } from '@/data/mock-restaurant-detail';
import { DetailHeader } from '@/components/features/restaurant-detail/detail-header';
import { PhotoGallery } from '@/components/features/restaurant-detail/photo-gallery';
import { RestaurantSummary } from '@/components/features/restaurant-detail/restaurant-summary';
import { ScorePanel } from '@/components/features/restaurant-detail/score-panel';
import { MyReviewSection } from '@/components/features/restaurant-detail/my-review-section';
import { ReviewFilterBar } from '@/components/features/restaurant-detail/review-filter-bar';
import { ReviewCard } from '@/components/features/restaurant-detail/review-card';
import { RepeatVisitReviewCard } from '@/components/features/restaurant-detail/repeat-visit-review';
import { LocationSection } from '@/components/features/restaurant-detail/location-section';
import { ReviewCtaBar } from '@/components/features/restaurant-detail/review-cta-bar';

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = getRestaurantDetail(id);
  if (!detail) notFound();

  const myVisitCount = detail.myReview?.visits.length ?? 0;
  const othersReviewCount = Math.max(0, detail.reviewCount - myVisitCount);
  const othersTitle = detail.myReview
    ? `다른 사람들의 리뷰 ${othersReviewCount}개`
    : `리뷰 ${detail.reviewCount}개`;

  const visibleReviews = detail.reviews.slice(0, 5);
  const remainingReviews = Math.max(0, othersReviewCount - visibleReviews.length);

  return (
    <>
      <DetailHeader />
      <main className="max-w-5xl mx-auto pb-28">
        <PhotoGallery photos={detail.photos} totalCount={detail.totalPhotoCount} />
        <RestaurantSummary detail={detail} />
        <ScorePanel detail={detail} />

        {detail.myReview && <MyReviewSection review={detail.myReview} />}

        <ReviewFilterBar title={othersTitle} />

        <div className="mt-2">
          {visibleReviews.length > 0 && <ReviewCard review={visibleReviews[0]} />}

          {detail.repeatVisitReview && (
            <RepeatVisitReviewCard review={detail.repeatVisitReview} />
          )}

          {visibleReviews.slice(1).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {remainingReviews > 0 && (
          <div className="px-6 pt-4">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              리뷰 <span className="font-numeric">{remainingReviews}</span>개 더 보기
              <ChevronDown className="w-4 h-4" />
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {visibleReviews.length} / {othersReviewCount}개 표시 중 · 신뢰도순
            </p>
          </div>
        )}

        <LocationSection detail={detail} />
      </main>
      <ReviewCtaBar restaurantId={detail.id} myReview={detail.myReview} />
    </>
  );
}
