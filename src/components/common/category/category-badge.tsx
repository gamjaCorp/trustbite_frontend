import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_STYLE } from '@/lib/domain/category';
import type { Category } from '@/lib/types/restaurant';

interface Props {
  category: Category;
  className?: string;
}

// 카테고리 텍스트 배지 — 한식·중식 등 카테고리를 작은 태그로 표시
export function CategoryBadge({ category, className }: Props) {
  return (
    <Badge className={cn('text-label-3', CATEGORY_STYLE[category], className)}>
      {category}
    </Badge>
  );
}
