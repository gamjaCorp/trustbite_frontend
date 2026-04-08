import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
      {/* 정렬 토글 */}
      <div className="flex gap-1.5">
        {(['score', 'recent'] as const).map((key) => (
          <button
            key={key}
            onClick={() => onSortChange(key)}
            className={cn(
              'rounded-chip px-3 py-1 text-xs font-medium transition-colors',
              sort === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {key === 'score' ? '점수순' : '최근 방문순'}
          </button>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        <Select value={category} onValueChange={(v) => onCategoryChange(v as Category | 'all')}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="text-xs">
                {c === 'all' ? '전체 카테고리' : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue placeholder="지역" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              전체 지역
            </SelectItem>
            {regions.map((r) => (
              <SelectItem key={r} value={r} className="text-xs">
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
