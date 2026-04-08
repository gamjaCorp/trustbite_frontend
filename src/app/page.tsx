import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RestaurantRankList } from '@/components/features/my_restaurant/restaurant_rank_list';
import { mockStats5, mockRankList } from '@/data/mock_restaurant';

export default function Home() {
  const { visitCount, reviewCount, trustScore } = mockStats5;

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* 타이틀 섹션 */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">나만의 미식 가이드</h1>
          <p className="text-sm text-muted-foreground">내가 직접 기록한 검증된 맛집들</p>
          <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
            <span>
              방문 <strong className="text-foreground">{visitCount}</strong>곳
            </span>
            <span>·</span>
            <span>
              리뷰 <strong className="text-foreground">{reviewCount}</strong>개
            </span>
            <span>·</span>
            <span>
              신뢰도 <strong className="text-score-high">{trustScore}%</strong>
            </span>
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
