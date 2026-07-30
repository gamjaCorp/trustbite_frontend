import { Award, Bookmark, ChefHat, Coffee, Crosshair, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Grade } from '@/types/grade';

type GradeCondition = 'INSTANT' | 'OR' | 'AND';

// 로컬 표현 정보 — 서버가 주지 않는 값만. 서버 grade와 name으로 매칭한다.
export interface GradeLocalDef {
  name: string;
  label: string;
  icon: LucideIcon;
  condition: GradeCondition;
  toneClass: { bg: string; text: string; ring: string };
}

// 서버 grade 정보 + 로컬 ui표시 병합 결과
export interface GradeLevelDef extends GradeLocalDef {
  rank: number;
  reviewMin: number;
  trustMin: number;
}

export const GRADE_LEVELS: readonly GradeLocalDef[] = [
  {
    name: 'SPROUT',
    label: '새싹',
    icon: Sprout,
    condition: 'INSTANT',
    toneClass: {
      bg: 'bg-palette-green/15',
      text: 'text-palette-green',
      ring: 'ring-palette-green/30',
    },
  },
  {
    name: 'REGULAR',
    label: '단골',
    icon: Coffee,
    condition: 'OR',
    toneClass: { bg: 'bg-primary/15', text: 'text-primary', ring: 'ring-primary/30' },
  },
  {
    name: 'COLLECTOR',
    label: '맛집 수집가',
    icon: Bookmark,
    condition: 'AND',
    toneClass: {
      bg: 'bg-palette-blue/15',
      text: 'text-palette-blue',
      ring: 'ring-palette-blue/30',
    },
  },
  {
    name: 'HUNTER',
    label: '맛집 헌터',
    icon: Crosshair,
    condition: 'AND',
    toneClass: {
      bg: 'bg-palette-amber/15',
      text: 'text-palette-amber',
      ring: 'ring-palette-amber/30',
    },
  },
  {
    name: 'GOURMET',
    label: '미식가',
    icon: ChefHat,
    condition: 'AND',
    toneClass: { bg: 'bg-palette-red/15', text: 'text-palette-red', ring: 'ring-palette-red/30' },
  },
  {
    name: 'MICHELIN',
    label: '미슐랭',
    icon: Award,
    condition: 'AND',
    toneClass: {
      bg: 'bg-palette-amber/15',
      text: 'text-palette-amber',
      ring: 'ring-palette-amber/30',
    },
  },
] as const;

// name으로 로컬 표현 정보 조회
export function nameTolocalGrade(name: string): GradeLocalDef | undefined {
  return GRADE_LEVELS.find((grade) => grade.name === name);
}

// 서버 등급 사다리에 로컬 표현(라벨·아이콘·색)을 붙인다 — 순위·문턱값은 서버가 소유하므로 로컬 폴백 없음
export function mergeGradeLadder(grades: Grade[] | null): GradeLevelDef[] {
  if (!grades || grades.length === 0) return [];

  return grades
    .map((grade) => {
      const local = nameTolocalGrade(grade.name);
      if (!local) return null; // 로컬에 표현 정보가 없는 등급은 그리지 않는다

      return {
        ...local,
        rank: grade.rank,
        reviewMin: grade.needRatingCount,
        trustMin: Math.round(grade.needTrustScore * 100),
      };
    })
    .filter((grade): grade is GradeLevelDef => grade !== null)
    .sort((a, b) => a.rank - b.rank);
}

interface LevelProgress {
  reviewPct: number;
  trustPct: number;
  reviewMet: boolean;
  trustMet: boolean;
  satisfiedForNext: boolean;
}

export function getProgressToNext(
  level: number,
  reviewCount: number,
  trustScore: number,
  mergedGrades: readonly GradeLevelDef[],
): LevelProgress | null {
  const next = mergedGrades.find((grade) => grade.rank > level) ?? null;
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
