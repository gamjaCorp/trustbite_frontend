import { Suspense } from 'react';
import Link from 'next/link';
import { Bookmark, ChevronRight, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsStrip } from '@/components/common/display/stats-strip';
import { MyPlacesTabs } from './_components';
import { mockStats5, mockRankList } from '@/data/mock-restaurant';

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function MyRestaurantPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab = tab === 'wishlist' ? 'wishlist' : 'ranking';
  const { reviewCount, trustScore } = mockStats5;
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, 임시 고정값 사용
  const level = 3;
  const levelDef = { label: '맛집 수집가', icon: Bookmark, toneClass: { text: 'text-palette-blue' } };

  return (
    <>
      <div className="max-w-5xl mx-auto px-5 lg:px-6 pt-6 pb-24">
        <div className="mt-8">
          <StatsStrip
            items={[
              { label: '리뷰', value: `${reviewCount}개` },
              { label: '신뢰도', value: `${trustScore}%`, valueClassName: 'text-primary' },
              {
                label: (
                  <span className="flex items-center gap-0.5">
                    등급 <ChevronRight className="w-3 h-3" />
                  </span>
                ),
                value: (
                  <span className={`flex items-center gap-1.5 ${levelDef.toneClass.text}`}>
                    <levelDef.icon className="w-5 h-5" />
                    Lv.{level}
                    <span className="text-body-2 text-muted-foreground font-normal">
                      {levelDef.label}
                    </span>
                  </span>
                ),
                href: '/profile',
              },
            ]}
          />
        </div>

        <Suspense>
          <MyPlacesTabs initialTab={activeTab} entries={mockRankList} reviewCount={reviewCount} />
        </Suspense>
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
