import type { GradeLevel } from '@/lib/domain/grade-levels';

export interface GradeContext {
  baseTrustScore: number; // 리뷰 작성 시점의 유저 신뢰도 점수
  currentLevel: GradeLevel;
  currentGradeReviewCount: number; // 현재 등급에서 작성한 리뷰 수
  currentGradeReviewTarget: number; // 현재 등급 목표 리뷰 수
  nextGradeName: string;
  remainingReviewsForNextGrade: number; // 다음 등급까지 남은 리뷰 수
}
