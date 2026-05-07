import Link from 'next/link';
import { PencilLine, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RestaurantRankList } from '@/components/features/my-restaurant/restaurant-rank-list';
import { TasteProfileSection } from '@/components/features/my-restaurant/taste-profile-section';
import { mockStats5, mockRankList } from '@/data/mock-restaurant';

export default function MyRestaurantPage() {
  const { visitCount, reviewCount, trustScore } = mockStats5;

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-24">
        <div className="flex items-start justify-between gap-4 px-1">
          <div className="space-y-0.5">
            <h1 className="text-headline-1 text-foreground">나만의 미식 가이드</h1>
            <p className="text-sm text-muted-foreground">내가 직접 기록한 검증된 맛집들</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
              <Share2 className="w-3.5 h-3.5" />
              공유하기
            </Button>
            <Button size="sm" className="gap-1.5 rounded-xl">
              <Users className="w-3.5 h-3.5" />
              함께 만들기
            </Button>
          </div>
        </div>

        <div className="mt-8 bg-card rounded-2xl shadow-card flex divide-x divide-border">
          <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
            <span className="text-headline-1 text-foreground">{visitCount}</span>
            <span className="text-xs text-muted-foreground">방문한 곳</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
            <span className="text-headline-1 text-foreground">{reviewCount}</span>
            <span className="text-xs text-muted-foreground">리뷰</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
            <span className="text-headline-1 text-score-high">{trustScore}</span>
            <span className="text-xs text-muted-foreground">신뢰도</span>
          </div>
        </div>

        <div className="mt-5">
          <TasteProfileSection entries={mockRankList} />
        </div>

        <div className="mt-12">
          <RestaurantRankList entries={mockRankList} />
        </div>
      </div>

      <Button
        asChild
        className="fixed bottom-8 right-8 rounded-chip gap-2 shadow-lg px-5 py-3 h-auto"
      >
        <Link href="/review/new">
          <PencilLine className="w-4 h-4" />
          리뷰 쓰기
        </Link>
      </Button>
    </>
  );
}
