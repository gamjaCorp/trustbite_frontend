'use client';

// 카테고리 칩 행 및 랭킹 필터 바 — 홈 탐색 / 나의 맛집 공용
import { Check, MapPin } from 'lucide-react';
import { Category, SceneTag } from '@/types/restaurant';
import { CATEGORY_STYLE } from '@/lib/category';
import { cn } from '@/lib/utils';
import { SelectList, SelectListItem } from '@/components/core/select-list';

export const CATEGORIES: Array<Category | 'all'> = [
  'all',
  '한식',
  '일식',
  '중식',
  '양식',
  '카페',
  '술집',
  '기타',
];

export const OCCASIONS: SceneTag[] = ['혼밥', '데이트', '회식', '다이어트'];

interface CategoryChipRowProps {
  category: Category | 'all';
  onCategoryChange: (c: Category | 'all') => void;
  categories: Array<Category | 'all'>;
}

// 카테고리 칩 가로 스크롤 행 — 활성 시 Check 아이콘 + CATEGORY_STYLE 색상
export function CategoryChipRow({ category, onCategoryChange, categories }: CategoryChipRowProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
      {categories.map((c) => {
        const active = category === c;
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
            {active && <Check aria-hidden className="w-3.5 h-3.5" />}
            {c === 'all' ? '전체' : c}
          </button>
        );
      })}
    </div>
  );
}

interface RankFilterBarProps {
  category: Category | 'all';
  onCategoryChange: (c: Category | 'all') => void;
  categories: Array<Category | 'all'>;
  // sort props — 미전달 시 정렬 SelectList 렌더 생략 (정렬이 외부 헤더에 있는 경우)
  sort?: string;
  onSortChange?: (s: string) => void;
  sortItems?: SelectListItem[];
  region: string;
  onRegionChange: (r: string) => void;
  regions: string[];
  // 상황 칩 — undefined이면 행 전체 생략
  occasions?: Set<SceneTag>;
  onOccasionToggle?: (tag: SceneTag) => void;
}

// 카테고리 칩 / (상황 칩 좌 + 지역·정렬 SelectList 우) 2행 필터 바
export function RankFilterBar({
  category,
  onCategoryChange,
  categories,
  sort,
  onSortChange,
  sortItems,
  region,
  onRegionChange,
  regions,
  occasions,
  onOccasionToggle,
}: RankFilterBarProps) {
  const showOccasions = occasions !== undefined && onOccasionToggle !== undefined;
  const showSort = sort !== undefined && onSortChange !== undefined && sortItems !== undefined;

  return (
    <div className="space-y-2">
      <CategoryChipRow
        category={category}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />
      {showOccasions && <div className="border-t border-dashed border-border" />}
      <div className="flex items-center justify-between gap-2">
        {/* 좌측: 상황 칩 */}
        {showOccasions ? (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-label-3 text-muted-foreground shrink-0">상황</span>
            {OCCASIONS.map((tag) => {
              const active = occasions.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onOccasionToggle(tag)}
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
        ) : (
          <div />
        )}

        {/* 우측: 지역 + (선택)정렬 */}
        <div className="flex items-center gap-1.5 shrink-0">
          <SelectList
            value={region}
            onValueChange={onRegionChange}
            icon={MapPin}
            placeholder="전체 지역"
            items={[
              { value: 'all', label: '전체 지역' },
              ...regions.map((r) => ({ value: r, label: r })),
            ]}
          />
          {showSort && (
            <SelectList value={sort} onValueChange={onSortChange!} items={sortItems!} />
          )}
        </div>
      </div>
    </div>
  );
}
