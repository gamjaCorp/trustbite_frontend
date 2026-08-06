'use client';

import { Check } from 'lucide-react';
import { Category } from '@/types/restaurant';
import { CATEGORY_ICON, CATEGORY_STYLE } from '@/lib/domain/category';
import { cn } from '@/lib/utils';

interface CategoryChipRowProps {
  category: Category | 'all';
  onCategoryChange: (c: Category | 'all') => void;
  categories: Array<Category | 'all'>;
}

// 카테고리 칩 가로 스크롤 행 — 활성 시 Check 아이콘 + CATEGORY_STYLE 색상
export function CategoryChipRow({ category, onCategoryChange, categories }: CategoryChipRowProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {categories.map((c) => {
        const active = category === c;
        const Icon = CATEGORY_ICON[c];
        return (
          <button
            key={c}
            type="button"
            aria-pressed={active}
            onClick={() => onCategoryChange(c)}
            className={cn(
              'inline-flex items-center gap-1 shrink-0 rounded-chip px-3 py-1.5 text-label-3 transition-colors',
              active
                ? c === 'all'
                  ? 'bg-foreground text-background'
                  : CATEGORY_STYLE[c as Category]
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {c !== 'all' && (
              active ? (
                <Check aria-hidden className="w-3.5 h-3.5" />
              ) : (
                <Icon aria-hidden className="w-3.5 h-3.5" />
              )
            )}
            {c === 'all' ? '전체' : c}
          </button>
        );
      })}
    </div>
  );
}
