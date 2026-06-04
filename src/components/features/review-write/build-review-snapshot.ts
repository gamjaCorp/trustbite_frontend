// 리뷰 제출 시 신뢰도 변화 + 결과 snapshot 구성 — 순수 함수, UI 의존 없음
import type {
  ReviewResultSnapshot,
  TrustBreakdown,
  SelectedRestaurant,
} from '@/stores/review-write-store';
import { LONG_TEXT_THRESHOLD, TRUST_DELTA } from '@/stores/review-write-store';
import type { GradeLevel } from '@/lib/domain/grade-levels';

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

// 리뷰 제출 결과 snapshot 생성 — trust 증분 계산 + 등급 진행도 반영
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
  const hasPhoto = photoCount > 0;
  const hasLongText = text.length >= LONG_TEXT_THRESHOLD;

  const breakdown: TrustBreakdown = {
    consistency: TRUST_DELTA.consistency,
    photo: hasPhoto ? TRUST_DELTA.photo : null,
    longText: hasLongText ? TRUST_DELTA.longText : null,
    total:
      TRUST_DELTA.consistency +
      (hasPhoto ? TRUST_DELTA.photo : 0) +
      (hasLongText ? TRUST_DELTA.longText : 0),
  };
  const nextTrustScore = Math.min(100, baseTrustScore + breakdown.total);

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
