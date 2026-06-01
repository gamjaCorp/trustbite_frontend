import { mockRankList } from '@/data/mock-restaurant';
import { ReviewWriteForm } from '@/components/features/review-write/index';
import { getLevelDef, getNextLevelDef } from '@/lib/domain/grade-levels';
import type { GradeLevel } from '@/lib/domain/grade-levels';

const CURRENT_LEVEL: GradeLevel = 3;
const BASE_TRUST_SCORE = 72;
const REMAINING_REVIEWS_FOR_NEXT_GRADE = 19;
const CURRENT_GRADE_REVIEW_COUNT = 11;
const CURRENT_GRADE_REVIEW_TARGET = getNextLevelDef(CURRENT_LEVEL)?.reviewMin ?? getLevelDef(CURRENT_LEVEL).reviewMin;
const NEXT_GRADE_NAME = getNextLevelDef(CURRENT_LEVEL)?.label ?? '';

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
