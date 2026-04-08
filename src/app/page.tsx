import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RestaurantRankList } from '@/components/features/my_restaurant/restaurant_rank_list';
import { mockStats5, mockRankList } from '@/data/mock_restaurant';

export default function Home() {
  const { visitCount, reviewCount, trustScore } = mockStats5;

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-24 space-y-5">
        {/* 타이틀 */}
        <div className="space-y-0.5 px-1">
          <h1 className="text-2xl font-bold text-foreground">나만의 미식 가이드</h1>
          <p className="text-sm text-muted-foreground">내가 직접 기록한 검증된 맛집들</p>
        </div>

        {/* 스탯 카드 */}
        <div className="bg-card rounded-2xl shadow-card flex divide-x divide-border">
          <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
            <span className="text-2xl font-bold text-foreground">{visitCount}</span>
            <span className="text-xs text-muted-foreground">방문한 곳</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
            <span className="text-2xl font-bold text-foreground">{reviewCount}</span>
            <span className="text-xs text-muted-foreground">리뷰</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
            <span className="text-2xl font-bold text-score-high">{trustScore}</span>
            <span className="text-xs text-muted-foreground">신뢰도</span>
          </div>
        </div>

        {/* 랭킹 리스트 */}
        <RestaurantRankList entries={mockRankList} />
      </div>

      {/* FAB */}
      <Button className="fixed bottom-8 right-8 rounded-chip gap-2 shadow-lg px-5 py-3 h-auto">
        <Plus className="w-4 h-4" />
        새 맛집 추가하기
      </Button>
    </>
  );
}
