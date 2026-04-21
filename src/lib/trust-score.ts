import type { Grade } from '@/types/restaurant';

export type TrustTone = 'high' | 'good' | 'mid' | 'low' | 'danger';

export function getTrustTone(score: number): TrustTone {
  if (score >= 80) return 'high';
  if (score >= 60) return 'good';
  if (score >= 40) return 'mid';
  if (score >= 20) return 'low';
  return 'danger';
}

export function getTrustToneClass(score: number): {
  text: string;
  bg: string;
  ring: string;
} {
  const tone = getTrustTone(score);
  return {
    high: { text: 'text-score-high', bg: 'bg-score-high/10', ring: 'ring-score-high/30' },
    good: { text: 'text-score-good', bg: 'bg-score-good/10', ring: 'ring-score-good/30' },
    mid: { text: 'text-score-mid', bg: 'bg-score-mid/10', ring: 'ring-score-mid/30' },
    low: { text: 'text-score-low', bg: 'bg-score-low/10', ring: 'ring-score-low/30' },
    danger: { text: 'text-score-danger', bg: 'bg-score-danger/10', ring: 'ring-score-danger/30' },
  }[tone];
}

export function getGradeToneClass(grade: Grade): {
  text: string;
  bg: string;
} {
  return {
    S: { text: 'text-grade-s', bg: 'bg-grade-s/10' },
    A: { text: 'text-grade-a', bg: 'bg-grade-a/10' },
    B: { text: 'text-grade-b', bg: 'bg-grade-b/10' },
    C: { text: 'text-grade-c', bg: 'bg-grade-c/10' },
    D: { text: 'text-grade-d', bg: 'bg-grade-d/10' },
  }[grade];
}

export const GRADE_LABEL: Record<Grade, string> = {
  S: '미슐랭',
  A: '미식가',
  B: '맛집 헌터',
  C: '맛집 수집가',
  D: '새싹',
};
