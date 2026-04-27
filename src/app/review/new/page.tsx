import { mockRankList } from '@/data/mock-restaurant';
import { ReviewWriteForm } from '@/components/features/review-write/review-write-form';

const BASE_TRUST_SCORE = 72;
const NEXT_GRADE_NAME = '맛집 헌터';
const REMAINING_REVIEWS_FOR_NEXT_GRADE = 19;

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
    />
  );
}
