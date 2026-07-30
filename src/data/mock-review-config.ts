// TODO: 1차 MVP 제외 — 백엔드 프로필 API 연동 시 교체 (현재 유저 레벨·신뢰도 점수 목 값)
import type { GradeContext } from '@/components/features/review-write/lib/grade-context';

// Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시 mock 고정값
const CURRENT_LEVEL: number = 3;
const BASE_TRUST_SCORE = 72;

export const MOCK_GRADE_CONTEXT: GradeContext = {
  baseTrustScore: BASE_TRUST_SCORE,
  currentLevel: CURRENT_LEVEL,
  currentGradeReviewCount: 11,
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, getLevelDef·getNextLevelDef 제거로 임시 mock 고정값 사용
  currentGradeReviewTarget: 30,
  nextGradeName: '맛집 헌터',
  remainingReviewsForNextGrade: 19,
};
