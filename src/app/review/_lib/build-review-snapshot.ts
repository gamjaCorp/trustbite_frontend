// 리뷰 제출 시 신뢰도 변화 + 결과 snapshot 구성 — 순수 함수, UI 의존 없음
import type { ReviewResultSnapshot, SelectedRestaurant } from './review-write-store';
import { computeTrustBreakdown, computeNextTrustScore } from '@/lib/domain/trust-delta';
import { toTrustPercent } from '@/lib/domain/trust-score';
import type { RatingResponse } from '@/types/rating';

interface BuildSnapshotParams {
  selected: SelectedRestaurant;
  photoCount: number; // photos.length — File 객체가 아닌 개수만 필요
  text: string;
  rating: RatingResponse;
  previousTrustScore: number; // 제출 전 신뢰도(0~100) — rating.trustScore가 null(리뷰 5개 미만)일 때 기준선 폴백
}

// 리뷰 제출 결과 snapshot 생성
export function buildReviewSnapshot({
  selected,
  photoCount,
  text,
  rating,
  previousTrustScore,
}: BuildSnapshotParams): ReviewResultSnapshot {
  // rating.trustScore는 리뷰 5개 미만이면 null(데이터 부족) — 0이 아니라 제출 전 값으로 대체
  // trustScore는 0.0~1.0 — 화면은 0~100 스케일이라 변환 필요 (week-4-issues.md 함정)
  const baseTrustScore =
    rating.trustScore != null ? toTrustPercent(rating.trustScore) : previousTrustScore;
  const currentGradeReviewCount = rating.reviewCount;
  const currentGradeReviewTarget = rating.reviewCount + (rating.needCount || 0);

  const breakdown = computeTrustBreakdown({ photoCount, textLength: text.length });
  const nextTrustScore = computeNextTrustScore(baseTrustScore, breakdown.total);

  return {
    restaurantId: selected.id,
    baseTrustScore,
    nextTrustScore,
    breakdown,
    photoCount,
    grade: rating.grade,
    currentGradeReviewCount,
    currentGradeReviewTarget,
    nextGrade: rating.nextGrade || '',
    remainingReviewsForNextGrade: rating.needCount || 0,
    // TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11)
  };
}
