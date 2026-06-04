'use client';

import { SceneTagChipRow } from '@/components/common/scene-tag-chip-row';
import {
  useRankActions,
  useRankCategory,
  useRankOccasions,
} from '@/stores/region-rank-store';
import { CategoryChipRow } from '@/components/common/category-chip-row';
import { CATEGORIES, OCCASIONS } from '@/lib/domain/category';
import type { SceneTag } from '@/lib/types/restaurant';
import { SearchAutocomplete } from './search-autocomplete';

// 검색창 + 카테고리 칩 + 상황 칩 묶음 — store hook 직접 소비
export function RankFilterControls() {
  const category = useRankCategory();
  const occasions = useRankOccasions();
  const action = useRankActions();

  return (
    <>
      <SearchAutocomplete
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
              <SceneTagChipRow
                tags={OCCASIONS}
                isActive={(t) => occasions.has(t as SceneTag)}
                onToggle={(t) => action.toggleOccasion(t as SceneTag)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
