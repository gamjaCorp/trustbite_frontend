import { Plus, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

// 지역 랭킹 리스트 결과 없음 빈 상태
export function RegionRankEmpty() {
  return (
    <Empty className="border-0 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UtensilsCrossed />
        </EmptyMedia>
        <EmptyTitle>이 지역엔 맛집이 없어요</EmptyTitle>
        <EmptyDescription>
          지도를 옮기거나 다른 검색어·필터로 다시 시도해보세요.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button className="gap-1.5 rounded-chip">
          <Plus className="w-4 h-4" />새 맛집 추가하기
        </Button>
      </EmptyContent>
    </Empty>
  );
}
