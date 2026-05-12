import type { Grade } from '@/types/restaurant';

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

export function getGradeToneClass(grade: Grade): {
  text: string;
  bg: string;
} {
  return {
    S: { text: 'text-palette-amber', bg: 'bg-palette-amber/10' },
    A: { text: 'text-palette-green', bg: 'bg-palette-green/10' },
    B: { text: 'text-palette-blue',  bg: 'bg-palette-blue/10' },
    C: { text: 'text-palette-gray',  bg: 'bg-palette-gray/10' },
    D: { text: 'text-palette-red',   bg: 'bg-palette-red/10' },
  }[grade];
}

export const GRADE_LABEL: Record<Grade, string> = {
  S: '미슐랭',
  A: '미식가',
  B: '맛집 헌터',
  C: '맛집 수집가',
  D: '새싹',
};

export const GRADE_REVIEW_TARGET: Record<Grade, number> = {
  D: 5,
  C: 30,
  B: 80,
  A: 150,
  S: 300,
};

export const NEXT_GRADE: Record<Grade, Grade | null> = {
  D: 'C',
  C: 'B',
  B: 'A',
  A: 'S',
  S: null,
};

export function getGradeReviewTarget(grade: Grade): number {
  return GRADE_REVIEW_TARGET[grade];
}
