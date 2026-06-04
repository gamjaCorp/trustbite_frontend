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
