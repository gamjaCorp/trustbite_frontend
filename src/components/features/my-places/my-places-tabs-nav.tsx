'use client';

// 내 맛집 탭 네비게이션 — URL 쿼리 동기화 담당 client 래퍼
import { useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface MyPlacesTabsNavProps {
  initialTab: 'ranking' | 'wishlist'; // 서버에서 내려온 초기 탭
  rankingPanel: React.ReactNode; // 나의 랭킹 탭 내용 (server 렌더)
  wishlistPanel: React.ReactNode; // 가고 싶은 맛집 탭 내용 (server 렌더)
}

// 내 맛집 탭 셸 — useSearchParams로 탭 값 파생, useRouter로 URL replace
export function MyPlacesTabsNav({ initialTab, rankingPanel, wishlistPanel }: MyPlacesTabsNavProps) {
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

      <TabsContent value="ranking">{rankingPanel}</TabsContent>

      <TabsContent value="wishlist">{wishlistPanel}</TabsContent>
    </Tabs>
  );
}
