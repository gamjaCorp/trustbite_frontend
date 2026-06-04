import { mockRankList } from '@/data/mock-restaurant';
import { ReviewWriteForm } from '@/components/features/review-write/index';
import {
  CURRENT_LEVEL,
  BASE_TRUST_SCORE,
  REMAINING_REVIEWS_FOR_NEXT_GRADE,
  CURRENT_GRADE_REVIEW_COUNT,
  CURRENT_GRADE_REVIEW_TARGET,
  NEXT_GRADE_NAME,
} from '@/data/mock-review-config';

// 리뷰 작성 페이지
export default function NewReviewPage() {
  const myTopRestaurants = [...mockRankList]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10);

  return (
    <ReviewWriteForm
      candidates={mockRankList}
      myTopRestaurants={myTopRestaurants}
      baseTrustScore={BASE_TRUST_SCORE}
      remainingReviewsForNextGrade={REMAINING_REVIEWS_FOR_NEXT_GRADE}
      nextGradeName={NEXT_GRADE_NAME}
      currentLevel={CURRENT_LEVEL}
      currentGradeReviewCount={CURRENT_GRADE_REVIEW_COUNT}
      currentGradeReviewTarget={CURRENT_GRADE_REVIEW_TARGET}
    />
  );
}
