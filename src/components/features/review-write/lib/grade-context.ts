export interface GradeContext {
  baseTrustScore: number; // 리뷰 작성 시점의 유저 신뢰도 점수
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시로 number 사용
  currentLevel: number;
  currentGradeReviewCount: number; // 현재 등급에서 작성한 리뷰 수
  currentGradeReviewTarget: number; // 현재 등급 목표 리뷰 수
  nextGradeName: string;
  remainingReviewsForNextGrade: number; // 다음 등급까지 남은 리뷰 수
}
