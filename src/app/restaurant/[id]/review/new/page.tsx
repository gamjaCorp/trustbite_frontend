import { notFound } from 'next/navigation';

import { getRestaurantDetail } from '@/data/mock-restaurant-detail';
import { mockRankList } from '@/data/mock-restaurant';
import { BackHeader } from '@/components/common/layout/back-header';
import { ReviewWriteForm } from '@/components/features/review-write/index';
import type { ReviewDraft, SelectedRestaurant } from '@/components/features/review-write/stores/review-write-store';
import { getMyProfile } from '@/api/user/user';

export default async function ReviewWritePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const [{ id }, { mode }] = await Promise.all([params, searchParams]);
  const detail = getRestaurantDetail(id);
  if (!detail) notFound();

  const profile = await getMyProfile();
  if (!profile) notFound();

  const myTopRestaurants = [...mockRankList]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  const initialSelectedRestaurant: SelectedRestaurant = {
    id: detail.id,
    name: detail.name,
    category: detail.category,
    region: detail.address,
    imageUrl: detail.photos[0],
    subtitle: detail.address,
    visitCount: detail.myReview?.visits.length ?? 0,
    // Fix: 상세가 아직 mock이라 실 Kakao apiPlaceId가 없음 — Day 4(/restaurant/[id] 마이그)에서 실 값으로 교체
    apiPlaceId: Number(detail.id),
    latitude: detail.coordinates.lat,
    longitude: detail.coordinates.lng,
    address: detail.address,
  };

  const latest = detail.myReview?.visits[0];
  const initialDraft: ReviewDraft | null =
    mode === 'edit' && latest
      ? {
          taste: latest.scores.taste,
          value: latest.scores.value,
          vibe: latest.scores.vibe,
          sceneTags: latest.sceneTags,
          text: latest.content,
          photos: (latest.photos ?? []).map((url) => ({ previewUrl: url })),
        }
      : null;

  return (
    <>
      <BackHeader />
      <ReviewWriteForm
        initialSelectedRestaurant={initialSelectedRestaurant}
        initialDraft={initialDraft}
        candidates={mockRankList}
        myTopRestaurants={myTopRestaurants}
        profile={profile}
      />
    </>
  );
}
