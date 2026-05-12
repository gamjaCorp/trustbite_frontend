import { mockRankList } from '@/data/mock-restaurant';
import { ReviewWriteForm } from '@/components/features/review-write/review-write-form';
import { getGradeReviewTarget } from '@/lib/trust-score';
import type { Grade } from '@/types/restaurant';

const BASE_TRUST_SCORE = 72;
const NEXT_GRADE_NAME = '맛집 헌터';
const REMAINING_REVIEWS_FOR_NEXT_GRADE = 19;
const CURRENT_GRADE: Grade = 'C';
const CURRENT_GRADE_REVIEW_COUNT = 11;
const CURRENT_GRADE_REVIEW_TARGET = getGradeReviewTarget(CURRENT_GRADE);

export default function NewReviewPage() {
  const myTopRestaurants = [...mockRankList]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  return (
    <ReviewWriteForm
      candidates={mockRankList}
      myTopRestaurants={myTopRestaurants}
      baseTrustScore={BASE_TRUST_SCORE}
      remainingReviewsForNextGrade={REMAINING_REVIEWS_FOR_NEXT_GRADE}
      nextGradeName={NEXT_GRADE_NAME}
      currentGrade={CURRENT_GRADE}
      currentGradeReviewCount={CURRENT_GRADE_REVIEW_COUNT}
      currentGradeReviewTarget={CURRENT_GRADE_REVIEW_TARGET}
    />
  );
}
