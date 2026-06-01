'use client';

// 나의 맛집 페이지 탭 — 나의 랭킹 / 가고 싶은 서브탭 + URL 쿼리 동기화
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RestaurantRankList } from '@/components/features/my-restaurant/restaurant-rank-list';
import { TasteProfileSection } from '@/components/common/taste-profile-section';
import { WishlistSection } from '@/components/features/my-restaurant/wishlist-section';
import { RegionalRankEntry } from '@/lib/types/restaurant/type';

interface Props {
  initialTab: 'ranking' | 'wishlist';
  entries: RegionalRankEntry[];
  reviewCount?: number;
}

export function MyPlacesTabs({ initialTab, entries, reviewCount }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? initialTab) as 'ranking' | 'wishlist';

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`/my-places?${params.toString()}`, { scroll: false });
  }

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="mt-6">
      <TabsList>
        <TabsTrigger value="ranking" className="px-4">
          나의 랭킹
        </TabsTrigger>
        <TabsTrigger value="wishlist" className="px-4">
          가고 싶은 맛집
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ranking">
        <div className="mt-5">
          <TasteProfileSection entries={entries} reviewCount={reviewCount} />
        </div>
        <div className="mt-12">
          <RestaurantRankList entries={entries} />
        </div>
      </TabsContent>

      <TabsContent value="wishlist">
        <WishlistSection />
      </TabsContent>
    </Tabs>
  );
}
