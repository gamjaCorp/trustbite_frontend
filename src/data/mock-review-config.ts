// TODO: 1차 MVP 제외 — 백엔드 프로필 API 연동 시 교체 (현재 유저 레벨·신뢰도 점수 목 값)
import { getLevelDef, getNextLevelDef } from '@/lib/domain/grade-levels';
import type { GradeLevel } from '@/lib/domain/grade-levels';
import type { GradeContext } from '@/components/features/review-write/lib/grade-context';

const CURRENT_LEVEL: GradeLevel = 3;
const BASE_TRUST_SCORE = 72;

export const MOCK_GRADE_CONTEXT: GradeContext = {
  baseTrustScore: BASE_TRUST_SCORE,
  currentLevel: CURRENT_LEVEL,
  currentGradeReviewCount: 11,
  currentGradeReviewTarget: getNextLevelDef(CURRENT_LEVEL)?.reviewMin ?? getLevelDef(CURRENT_LEVEL).reviewMin,
  nextGradeName: getNextLevelDef(CURRENT_LEVEL)?.label ?? '',
  remainingReviewsForNextGrade: 19,
};
