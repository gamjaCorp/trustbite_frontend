'use client';

// 팔로워·팔로잉 탭 네비게이션 — URL 기반 탭 전환 담당 client 래퍼
import { useRouter } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { FollowTabKey } from '@/types/follow';

interface FollowTabsProps {
  initialTab: FollowTabKey; // 현재 활성 탭 (라우트 기반)
  basePath: string; // 탭 전환 시 replace 할 경로 prefix
  followersCount: number; // 팔로워 수 배지
  followingCount: number; // 팔로잉 수 배지
  followersPanel: React.ReactNode; // 팔로워 목록 (server 렌더)
  followingPanel: React.ReactNode; // 팔로잉 목록 (server 렌더)
}

// 팔로워·팔로잉 탭 셸 — useRouter로 URL replace, 패널은 server 렌더 ReactNode로 주입
export function FollowTabs({
  initialTab,
  basePath,
  followersCount,
  followingCount,
  followersPanel,
  followingPanel,
}: FollowTabsProps) {
  const router = useRouter();

  function handleTabChange(value: string) {
    router.replace(`${basePath}/${value}`, { scroll: false });
  }

  return (
    <Tabs value={initialTab} onValueChange={handleTabChange} className="mt-4">
      <div className="px-8">
        <TabsList>
          <TabsTrigger value="followers">
            팔로워{' '}
            {followersCount > 0 && (
              <span className="ml-1 text-muted-foreground">{followersCount}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="following">
            팔로잉{' '}
            {followingCount > 0 && (
              <span className="ml-1 text-muted-foreground">{followingCount}</span>
            )}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="followers" className="mt-4">
        {followersPanel}
      </TabsContent>

      <TabsContent value="following" className="mt-4">
        {followingPanel}
      </TabsContent>
    </Tabs>
  );
}
