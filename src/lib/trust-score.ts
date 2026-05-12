export type TrustTone = 'high' | 'mid' | 'danger';

export function getTrustTone(score: number): TrustTone {
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
    high:   { text: 'text-palette-green', bg: 'bg-palette-green/10', ring: 'ring-palette-green/30' },
    mid:    { text: 'text-palette-amber', bg: 'bg-palette-amber/10', ring: 'ring-palette-amber/30' },
    danger: { text: 'text-palette-red',   bg: 'bg-palette-red/10',   ring: 'ring-palette-red/30' },
  }[tone];
}
