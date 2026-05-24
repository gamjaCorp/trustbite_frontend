// 카테고리별 아이콘 핀 — primary 색상 통일, 아이콘만 카테고리별로 구분
import { Coffee, Beer, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Category } from '@/types/restaurant';

interface Props {
  category: Category;
  active?: boolean;
}

const ICON_MAP: Partial<Record<Category, LucideIcon>> = {
  카페: Coffee,
  술집: Beer,
};

const DEFAULT_ICON = UtensilsCrossed;

export function CategoryPin({ category, active = false }: Props) {
  const Icon = ICON_MAP[category] ?? DEFAULT_ICON;
  const size = active ? 32 : 28;

  return (
    <div
      className="rounded-full bg-primary border-[3px] border-white flex items-center justify-center"
      style={{
        width: size,
        height: size,
        boxShadow: active
          ? '0 0 0 3px rgba(255,122,0,0.25), 0 4px 8px rgba(0,0,0,0.2)'
          : '0 2px 6px rgba(0,0,0,0.18)',
      }}
    >
      <Icon size={Math.round(size * 0.45)} color="#fff" strokeWidth={2.5} />
    </div>
  );
}
