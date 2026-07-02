// 리뷰 제출 시 신뢰도 변화 + 결과 snapshot 구성 — 순수 함수, UI 의존 없음
import type { ReviewResultSnapshot, SelectedRestaurant } from '../stores/review-write-store';
import { computeTrustBreakdown, computeNextTrustScore } from '@/lib/domain/trust-delta';
import type { GradeContext } from './grade-context';

interface BuildSnapshotParams {
  selected: SelectedRestaurant;
  photoCount: number; // photos.length — File 객체가 아닌 개수만 필요
  text: string;
  gradeContext: GradeContext;
}

// 리뷰 제출 결과 snapshot 생성
export function buildReviewSnapshot({
  selected,
  photoCount,
  text,
  gradeContext,
}: BuildSnapshotParams): ReviewResultSnapshot {
  const {
    baseTrustScore,
    currentLevel,
    currentGradeReviewCount,
    currentGradeReviewTarget,
    nextGradeName,
    remainingReviewsForNextGrade,
  } = gradeContext;

  const breakdown = computeTrustBreakdown({ photoCount, textLength: text.length });
  const nextTrustScore = computeNextTrustScore(baseTrustScore, breakdown.total);

  return {
    restaurantId: selected.id,
    baseTrustScore,
    nextTrustScore,
    breakdown,
    photoCount,
    currentLevel,
    currentGradeReviewCount: currentGradeReviewCount + 1,
    currentGradeReviewTarget,
    nextGradeName,
    remainingReviewsForNextGrade: Math.max(0, remainingReviewsForNextGrade - 1),
    // TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11)
  };
}
