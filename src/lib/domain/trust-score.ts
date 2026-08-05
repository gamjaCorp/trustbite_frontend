// 신뢰도 원시값(0.0~1.0)을 화면용 소수점 1자리 백분율로 변환 — 부동소수점 오차 방지를 위해 정수가 아닌 1자리까지만 반올림
export function toTrustPercent(raw: number): number {
  return Math.round(raw * 1000) / 10;
}

type TrustTone = 'high' | 'mid' | 'danger';

function getTrustTone(score: number): TrustTone {
  if (score >= 60) return 'high';
  if (score >= 30) return 'mid';
  return 'danger';
}

export function getTrustToneClass(score: number): {
  text: string;
  bg: string;
  ring: string;
} {
  const tone = getTrustTone(score);
  return {
    high:   { text: 'text-success', bg: 'bg-success/10', ring: 'ring-success/30' },
    mid:    { text: 'text-warning', bg: 'bg-warning/10', ring: 'ring-warning/30' },
    danger: { text: 'text-error',   bg: 'bg-error/10',   ring: 'ring-error/30' },
  }[tone];
}
