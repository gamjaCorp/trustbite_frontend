'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/core/search-input';
import {
  useRankActions,
  useRankCategory,
  useRankOccasions,
  useRankQuery,
} from '@/stores/region-rank-store';
import { CategoryChipRow } from '@/components/common/category-chip-row';
import { CATEGORIES, OCCASIONS } from '@/lib/category';

// 검색창 + 카테고리 칩 + 상황 칩 묶음 — store hook 직접 소비, props 없음
export function RankFilterControls() {
  const query = useRankQuery();
  const category = useRankCategory();
  const occasions = useRankOccasions();
  const action = useRankActions();

  return (
    <>
      <SearchInput
        value={query}
        onValueChange={action.setQuery}
        placeholder="맛집, 지역, 메뉴 검색"
        className="w-full mb-4"
      />

      <div className="flex flex-col gap-2">
        <CategoryChipRow
          category={category}
          onCategoryChange={action.setCategory}
          categories={CATEGORIES}
        />

        {/* TODO: 1차 MVP 제외 — 사용자 sceneTag 누적 기반 필터, 2차 MVP에서 백엔드 aggregate API 후 재노출 */}
        {false && (
          <>
            <div className="border-t border-dashed border-border" />

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-label-3 text-muted-foreground shrink-0">상황</span>
              {OCCASIONS.map((tag) => {
                const active = occasions.has(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={active}
                    onClick={() => action.toggleOccasion(tag)}
                    className={cn(
                      'inline-flex items-center gap-1 shrink-0 rounded-chip px-3 py-1.5 text-label-3 transition-colors',
                      active
                        ? 'bg-primary-subtle text-primary'
                        : 'bg-muted text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {active && <Check aria-hidden className="w-3.5 h-3.5" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
