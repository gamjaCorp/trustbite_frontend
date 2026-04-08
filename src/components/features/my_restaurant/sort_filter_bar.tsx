import { cn } from '@/lib/utils';
import { CATEGORY_STYLE } from '@/lib/category';
import { Category, SortKey } from '@/types/restaurant';

const CATEGORIES: Array<Category | 'all'> = [
  'all',
  '한식',
  '일식',
  '중식',
  '양식',
  '카페',
  '술집',
  '기타',
];

interface Props {
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  category: Category | 'all';
  onCategoryChange: (v: Category | 'all') => void;
  region: string | 'all';
  onRegionChange: (v: string | 'all') => void;
  regions: string[];
}

export function SortFilterBar({
  sort,
  onSortChange,
  category,
  onCategoryChange,
  region,
  onRegionChange,
  regions,
}: Props) {
  return (
    <div className="space-y-2">
      {/* 정렬 + 카테고리 */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        {(['score', 'recent'] as const).map((key) => (
          <button
            key={key}
            onClick={() => onSortChange(key)}
            className={cn(
              'shrink-0 rounded-chip px-3 py-1.5 text-xs font-medium transition-colors',
              sort === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {key === 'score' ? '점수순' : '최근 방문순'}
          </button>
        ))}

        <div className="w-px h-4 bg-border shrink-0" />

        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={cn(
              'shrink-0 rounded-chip px-3 py-1.5 text-xs font-medium transition-colors',
              category === c
                ? c === 'all'
                  ? 'bg-foreground text-background'
                  : CATEGORY_STYLE[c as Category]
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {c === 'all' ? '전체' : c}
          </button>
        ))}
      </div>

      {/* 지역 필터 (복수 지역일 때만) */}
      {regions.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          <button
            onClick={() => onRegionChange('all')}
            className={cn(
              'shrink-0 rounded-chip px-3 py-1.5 text-xs font-medium transition-colors',
              region === 'all'
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            전체 지역
          </button>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              className={cn(
                'shrink-0 rounded-chip px-3 py-1.5 text-xs font-medium transition-colors',
                region === r
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
