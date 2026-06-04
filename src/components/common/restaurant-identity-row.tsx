import { cn } from '@/lib/utils';
import { CategoryBadge } from '@/components/common/category-badge';
import type { Category } from '@/lib/types/restaurant';

interface Props {
  name: string;
  category: Category;
  subtitle: string; // 지역, 주소, 또는 조합 텍스트
  className?: string;
}

// 음식점 이름 + 카테고리 뱃지 + 부제(지역/주소) 한 쌍 — 리스트 행·카드에서 공통으로 사용
export function RestaurantIdentityRow({ name, category, subtitle, className }: Props) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-title-2 text-foreground truncate">{name}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <CategoryBadge category={category} />
        <span className="text-caption-2 text-muted-foreground truncate">{subtitle}</span>
      </div>
    </div>
  );
}
