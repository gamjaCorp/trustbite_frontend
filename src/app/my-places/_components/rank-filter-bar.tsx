'use client';

// my-places 랭킹 sticky 필터바 — 카테고리 칩 + 상황 칩 행 (top에 고정)
import type { Category, SceneTag } from '@/types/restaurant';
import { CategoryChipRow } from '@/components/common/category/category-chip-row';
import { SceneTagChipRow } from '@/components/common/display/scene-tag-chip-row';
import { CATEGORIES, OCCASIONS } from '@/lib/domain/category';
import {
  useMyRankCategory,
  useMyRankFilterActions,
  useMyRankOccasions,
} from '../_lib/my-rank-filter-store';

// my-places 전체 랭킹용 카테고리·상황 필터 바 — 상단 sticky
export function RankFilterBar() {
  const category = useMyRankCategory();
  const occasions = useMyRankOccasions();
  const action = useMyRankFilterActions();

  return (
    <div className="sticky top-[var(--header-height)] z-10 bg-background py-3 mt-3 space-y-2">
      <CategoryChipRow
        category={category}
        onCategoryChange={(c) => action.setCategory(c as Category | 'all')}
        categories={CATEGORIES}
      />

      <div className="mt-2 border-t border-dashed border-border" />

      {/* 상황 칩 행 */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-label-3 text-muted-foreground shrink-0">상황</span>
        <SceneTagChipRow
          tags={OCCASIONS}
          isActive={(t) => occasions.has(t as SceneTag)}
          onToggle={(t) => action.toggleOccasion(t as SceneTag)}
        />
      </div>
    </div>
  );
}
