import { mockRankList } from '@/data/mock-restaurant';
import { ReviewWriteForm } from '@/components/features/review-write/index';
import { MOCK_GRADE_CONTEXT } from '@/data/mock-review-config';

// 리뷰 작성 페이지
export default function NewReviewPage() {
  const myTopRestaurants = [...mockRankList]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10);

  return (
    <ReviewWriteForm
      candidates={mockRankList}
      myTopRestaurants={myTopRestaurants}
      gradeContext={MOCK_GRADE_CONTEXT}
    />
  );
}
