import { notFound } from 'next/navigation';

import { getRestaurantDetail } from '@/data/mock-restaurant-detail';
import { mockRankList } from '@/data/mock-restaurant';
import { BackHeader } from '@/components/common/layout/back-header';
import { ReviewWriteForm } from '@/components/features/review-write/index';
import { getLevelDef, getNextLevelDef } from '@/lib/grade-levels';
import type { GradeLevel } from '@/lib/grade-levels';
import type { ReviewDraft, SelectedRestaurant } from '@/stores/review-write-store';

const CURRENT_LEVEL: GradeLevel = 3;
const BASE_TRUST_SCORE = 72;
const REMAINING_REVIEWS_FOR_NEXT_GRADE = 19;
const CURRENT_GRADE_REVIEW_COUNT = 11;
const CURRENT_GRADE_REVIEW_TARGET = getNextLevelDef(CURRENT_LEVEL)?.reviewMin ?? getLevelDef(CURRENT_LEVEL).reviewMin;
const NEXT_GRADE_NAME = getNextLevelDef(CURRENT_LEVEL)?.label ?? '';

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
        baseTrustScore={BASE_TRUST_SCORE}
        remainingReviewsForNextGrade={REMAINING_REVIEWS_FOR_NEXT_GRADE}
        nextGradeName={NEXT_GRADE_NAME}
        currentLevel={CURRENT_LEVEL}
        currentGradeReviewCount={CURRENT_GRADE_REVIEW_COUNT}
        currentGradeReviewTarget={CURRENT_GRADE_REVIEW_TARGET}
      />
    </>
  );
}
