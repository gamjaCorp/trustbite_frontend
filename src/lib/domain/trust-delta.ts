export const LONG_TEXT_THRESHOLD = 100;

// TODO: 신뢰도 임시값
export const TRUST_DELTA = {
  consistency: 1.5,
  photo: 2.1,
  longText: 1.4,
} as const;

// 전체 신뢰도 계산
export type TrustBreakdown = {
  consistency: number;
  photo: number | null;
  longText: number | null;
  total: number;
};

export function computeTrustBreakdown({
  photoCount,
  textLength,
}: {
  photoCount: number;
  textLength: number;
}): TrustBreakdown {
  return {
    consistency: TRUST_DELTA.consistency,
    photo: photoCount > 0 ? TRUST_DELTA.photo : null,
    longText: textLength >= LONG_TEXT_THRESHOLD ? TRUST_DELTA.longText : null,
    total:
      TRUST_DELTA.consistency +
      (photoCount > 0 ? TRUST_DELTA.photo : 0) +
      (textLength >= LONG_TEXT_THRESHOLD ? TRUST_DELTA.longText : 0),
  };
}

// 향상된 신뢰도
export function computeNextTrustScore(base: number, total: number): number {
  return Math.min(100, base + total);
}
