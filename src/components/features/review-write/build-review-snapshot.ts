// 리뷰 제출 시 신뢰도 변화 + 결과 snapshot 구성 — 순수 함수, UI 의존 없음
import type { ReviewResultSnapshot, SelectedRestaurant } from '@/stores/review-write-store';
import type { GradeLevel } from '@/lib/domain/grade-levels';
import { computeTrustBreakdown, computeNextTrustScore } from '@/lib/domain/trust-delta';
interface BuildSnapshotParams {
  selected: SelectedRestaurant;
  photoCount: number; // photos.length — File 객체가 아닌 개수만 필요
  text: string;
  baseTrustScore: number;
  currentLevel: GradeLevel;
  currentGradeReviewCount: number;
  currentGradeReviewTarget: number;
  nextGradeName: string;
  remainingReviewsForNextGrade: number;
}

// 리뷰 제출 결과 snapshot 생성
export function buildReviewSnapshot({
  selected,
  photoCount,
  text,
  baseTrustScore,
  currentLevel,
  currentGradeReviewCount,
  currentGradeReviewTarget,
  nextGradeName,
  remainingReviewsForNextGrade,
}: BuildSnapshotParams): ReviewResultSnapshot {
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
    // pointsEarned: 5 + (hasPhoto ? 3 : 0) + (text.length >= 100 ? 2 : 0),
    // pointReasons: [
    //   { label: '리뷰', value: 5 },
    //   ...(hasPhoto ? [{ label: '사진', value: 3 }] : []),
    //   ...(text.length >= 100 ? [{ label: '100자', value: 2 }] : []),
    // ],
  };
}
