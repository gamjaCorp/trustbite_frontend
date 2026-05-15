import { notFound } from 'next/navigation';
import { getRestaurantDetail } from '@/data/mock-restaurant-detail';
import { DetailHeader } from '@/components/features/restaurant-detail/detail-header';
import { PhotoGallery } from '@/components/features/restaurant-detail/photo-gallery';
import { RestaurantSummary } from '@/components/features/restaurant-detail/restaurant-summary';
import { ScorePanel } from '@/components/features/restaurant-detail/score-panel';
import { MyReviewSection } from '@/components/features/restaurant-detail/my-review-section';
import { ReviewFilterBar } from '@/components/features/restaurant-detail/review-filter-bar';
import { LoggedOutReviewGate } from '@/components/features/restaurant-detail/logged-out-review-gate';
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

  return (
    <>
      <DetailHeader />
      <main className="max-w-5xl mx-auto pb-28">
        <PhotoGallery photos={detail.photos} totalCount={detail.totalPhotoCount} />
        <RestaurantSummary detail={detail} />
        <ScorePanel detail={detail} />

        {detail.myReview && <MyReviewSection review={detail.myReview} />}

        <ReviewFilterBar title={othersTitle} />

        <LoggedOutReviewGate
          reviews={detail.reviews}
          othersReviewCount={othersReviewCount}
          restaurantId={detail.id}
        />

        <LocationSection detail={detail} />
      </main>
      <ReviewCtaBar restaurantId={detail.id} myReview={detail.myReview} />
    </>
  );
}
