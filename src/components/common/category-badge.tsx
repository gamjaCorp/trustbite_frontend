import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_STYLE } from '@/lib/category';
import type { Category } from '@/types/restaurant';

interface Props {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: Props) {
  return (
    <Badge className={cn('text-label-3', CATEGORY_STYLE[category], className)}>
      {category}
    </Badge>
  );
}
