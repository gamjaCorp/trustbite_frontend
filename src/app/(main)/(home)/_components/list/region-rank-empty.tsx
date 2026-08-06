import { Plus, UtensilsCrossed } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/core/empty-state';

// 지역 랭킹 리스트 결과 없음 빈 상태
export function RegionRankEmpty() {
  return (
    <EmptyState
      icon={UtensilsCrossed}
      title="이 지역엔 맛집이 없어요"
      description="지도를 옮기거나 다른 검색어·필터로 다시 시도해보세요."
      cta={
        <Button className="gap-1.5">
          <Plus className="w-4 h-4" />새 맛집 추가하기
        </Button>
      }
    />
  );
}
