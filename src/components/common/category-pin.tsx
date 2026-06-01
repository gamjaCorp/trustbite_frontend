// 카테고리별 아이콘 핀 — 원형 핀에 카테고리 아이콘 표시, active 시 브랜드 컬러·확대·헤일로로 강조
import { Coffee, Beer, Utensils } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRankMedalClasses } from '@/lib/rank';
import type { Category } from '@/types/restaurant';

interface Props {
  category: Category;
  active?: boolean;
  rank?: number; // 핀에 표시할 순위 번호
  showRank?: boolean; // true면 아이콘 대신 순위 번호 표시 (hasRealData 시)
}

const ICON_MAP: Partial<Record<Category, LucideIcon>> = {
  카페: Coffee,
  술집: Beer,
};

const DEFAULT_ICON = Utensils;

export function CategoryPin({ category, active = false, rank, showRank = false }: Props) {
  const Icon = ICON_MAP[category] ?? DEFAULT_ICON;
  const size = active ? 36 : 26;
  const displayRank = showRank && rank != null;

  // active 우선 → 실데이터 핀은 메달 색 → 나머지 회색
  const bgClass = active
    ? 'bg-primary ring-4 ring-primary/30'
    : displayRank
      ? (getRankMedalClasses(rank!) ?? 'bg-neutral-400')
      : 'bg-neutral-400';

  return (
    <div
      className={cn(
        'rounded-full border-2 border-background flex items-center justify-center transition-all duration-150 overflow-hidden',
        bgClass,
      )}
      style={{
        width: size,
        height: size,
        boxShadow: active
          ? '0 4px 12px rgba(0,0,0,0.25)'
          : '0 2px 6px rgba(0,0,0,0.18)',
      }}
    >
      {displayRank ? (
        <span
          className="text-white font-bold tabular-nums leading-none"
          style={{ fontSize: Math.round(size * 0.42) }}
        >
          {rank}
        </span>
      ) : (
        <Icon size={Math.round(size * 0.45)} color="#fff" strokeWidth={2.5} />
      )}
    </div>
  );
}
