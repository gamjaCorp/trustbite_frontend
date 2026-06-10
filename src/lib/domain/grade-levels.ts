import { Award, Bookmark, ChefHat, Coffee, Crosshair, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type GradeName = 'SPROUT' | 'REGULAR' | 'COLLECTOR' | 'HUNTER' | 'GOURMET' | 'MICHELIN';

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6;

const GRADE_NAME_TO_LEVEL: Record<GradeName, GradeLevel> = {
  SPROUT: 1,
  REGULAR: 2,
  COLLECTOR: 3,
  HUNTER: 4,
  GOURMET: 5,
  MICHELIN: 6,
};

export function gradeNameToLevel(name: GradeName) {
  return GRADE_NAME_TO_LEVEL[name];
}

type GradeCondition = 'INSTANT' | 'OR' | 'AND';

export interface GradeLevelDef {
  level: GradeLevel;
  label: string;
  icon: LucideIcon;
  reviewMin: number;
  trustMin: number;
  condition: GradeCondition;
  toneClass: { bg: string; text: string; ring: string };
}

export const GRADE_LEVELS: readonly GradeLevelDef[] = [
  {
    level: 1,
    label: '새싹',
    icon: Sprout,
    reviewMin: 0,
    trustMin: 0,
    condition: 'INSTANT',
    toneClass: {
      bg: 'bg-palette-green/15',
      text: 'text-palette-green',
      ring: 'ring-palette-green/30',
    },
  },
  {
    level: 2,
    label: '단골',
    icon: Coffee,
    reviewMin: 3,
    trustMin: 30,
    condition: 'OR',
    toneClass: { bg: 'bg-primary/15', text: 'text-primary', ring: 'ring-primary/30' },
  },
  {
    level: 3,
    label: '맛집 수집가',
    icon: Bookmark,
    reviewMin: 10,
    trustMin: 40,
    condition: 'AND',
    toneClass: {
      bg: 'bg-palette-blue/15',
      text: 'text-palette-blue',
      ring: 'ring-palette-blue/30',
    },
  },
  {
    level: 4,
    label: '맛집 헌터',
    icon: Crosshair,
    reviewMin: 30,
    trustMin: 60,
    condition: 'AND',
    toneClass: {
      bg: 'bg-palette-amber/15',
      text: 'text-palette-amber',
      ring: 'ring-palette-amber/30',
    },
  },
  {
    level: 5,
    label: '미식가',
    icon: ChefHat,
    reviewMin: 70,
    trustMin: 75,
    condition: 'AND',
    toneClass: { bg: 'bg-palette-red/15', text: 'text-palette-red', ring: 'ring-palette-red/30' },
  },
  {
    level: 6,
    label: '미슐랭',
    icon: Award,
    reviewMin: 150,
    trustMin: 90,
    condition: 'AND',
    toneClass: {
      bg: 'bg-palette-amber/15',
      text: 'text-palette-amber',
      ring: 'ring-palette-amber/30',
    },
  },
] as const;

export function getLevelDef(level: GradeLevel): GradeLevelDef {
  return GRADE_LEVELS[level - 1];
}

export function getNextLevelDef(level: GradeLevel): GradeLevelDef | null {
  if (level >= 6) return null;
  return GRADE_LEVELS[level] as GradeLevelDef;
}

interface LevelProgress {
  reviewPct: number;
  trustPct: number;
  reviewMet: boolean;
  trustMet: boolean;
  satisfiedForNext: boolean;
}

export function getProgressToNext(
  level: GradeLevel,
  reviewCount: number,
  trustScore: number,
): LevelProgress | null {
  const next = getNextLevelDef(level);
  if (!next) return null;

  const reviewPct =
    next.reviewMin === 0 ? 100 : Math.min(100, Math.round((reviewCount / next.reviewMin) * 100));
  const trustPct =
    next.trustMin === 0 ? 100 : Math.min(100, Math.round((trustScore / next.trustMin) * 100));
  const reviewMet = reviewCount >= next.reviewMin;
  const trustMet = trustScore >= next.trustMin;
  const satisfiedForNext = next.condition === 'OR' ? reviewMet || trustMet : reviewMet && trustMet;

  return { reviewPct, trustPct, reviewMet, trustMet, satisfiedForNext };
}
