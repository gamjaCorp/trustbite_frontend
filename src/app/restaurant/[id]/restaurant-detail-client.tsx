'use client';

// TODO: 1차 MVP 제외 — 백엔드 상세 API 도착 시 cache lookup 로직 제거 후 server component로 복원
import { useQueryClient } from '@tanstack/react-query';
import { getRestaurantDetail } from '@/data/mock-restaurant-detail';
import { findPlaceInCache } from '@/lib/find-place-in-cache';
import { synthesizeDetailFromEntry } from '@/lib/synthesize-restaurant-detail';
import { useLocationMeta } from '@/components/features/restaurant-detail/hooks/use-location-meta';
import { useNearestStation } from '@/components/features/restaurant-detail/hooks/use-nearest-station';
import { BackHeader } from '@/components/common/layout/back-header';
import { PhotoGallery } from '@/components/features/restaurant-detail/photo-gallery';
import { RestaurantSummary } from '@/components/features/restaurant-detail/restaurant-summary';
import { ScorePanel } from '@/components/features/restaurant-detail/score-panel';
import { MyReviewSection } from '@/components/features/restaurant-detail/my-review-section';
import { ReviewFilterBar } from '@/components/features/restaurant-detail/review-filter-bar';
import { LoggedOutReviewGate } from '@/components/features/restaurant-detail/logged-out-review-gate';
import { EmptyReviewCard } from '@/components/features/restaurant-detail/empty-review-card';
import { LocationSection } from '@/components/features/restaurant-detail/location-section';
import { ReviewCtaBar } from '@/components/features/restaurant-detail/review-cta-bar';

interface Props {
  id: string;
}

// 음식점 상세 페이지 본체 — mock / Kakao cache / empty 세 분기 동일 레이아웃
export function RestaurantDetailClient({ id }: Props) {
  const qc = useQueryClient();
  const baseDetail =
    getRestaurantDetail(id) ?? synthesizeDetailFromEntry(findPlaceInCache(qc, id), id);

  const { data: locationMeta } = useLocationMeta(baseDetail.coordinates, !!baseDetail.coordinates);
  const { data: nearestStation } = useNearestStation(baseDetail.coordinates, !!baseDetail.coordinates);

  const detail = {
    ...baseDetail,
    buildingName: baseDetail.buildingName ?? locationMeta?.buildingName,
    administrativeArea: baseDetail.administrativeArea ?? locationMeta?.administrativeArea,
    nearestStation: baseDetail.nearestStation ?? nearestStation ?? undefined,
  };

  const isEmpty = detail.reviewCount === 0;
  const myVisitCount = detail.myReview?.visits.length ?? 0;
  const othersReviewCount = Math.max(0, detail.reviewCount - myVisitCount);
  const othersTitle = detail.myReview
    ? `다른 사람들의 리뷰 ${othersReviewCount}개`
    : `리뷰 ${detail.reviewCount}개`;

  return (
    <>
      <BackHeader />
      <main className="max-w-5xl mx-auto pb-28">
        <PhotoGallery photos={detail.photos} totalCount={detail.totalPhotoCount} />
        <RestaurantSummary detail={detail} />

        {!isEmpty && <ScorePanel detail={detail} />}

        {!isEmpty && detail.myReview && (
          <MyReviewSection review={detail.myReview} restaurantId={detail.id} />
        )}

        {isEmpty ? (
          <EmptyReviewCard restaurantId={detail.id} />
        ) : (
          <>
            <ReviewFilterBar title={othersTitle} />
            <LoggedOutReviewGate
              reviews={detail.reviews}
              othersReviewCount={othersReviewCount}
              restaurantId={detail.id}
            />
          </>
        )}

        <LocationSection detail={detail} />
      </main>
      <ReviewCtaBar restaurantId={detail.id} myReview={detail.myReview} />
    </>
  );
}
