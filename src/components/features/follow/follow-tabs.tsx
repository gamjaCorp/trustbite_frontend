'use client';

// 팔로워·팔로잉 탭 네비게이션 — ?tab= 쿼리 기반 탭 전환 담당 client 래퍼
import { useRouter } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FollowTabKey } from '@/types/follow';

interface FollowTabsProps {
  initialTab: FollowTabKey; // 현재 활성 탭
  basePath: string; // 탭 전환 시 ?tab= 쿼리를 붙여 이동할 경로
  followersCount: number; // 팔로워 수 배지
  followingCount: number; // 팔로잉 수 배지
  panel: React.ReactNode; // 현재 탭의 목록 (server 렌더)
}

// 팔로워·팔로잉 탭 셸 — useRouter로 ?tab= 쿼리 replace, 패널은 현재 탭 하나만 server 렌더 ReactNode로 주입
export function FollowTabs({
  initialTab,
  basePath,
  followersCount,
  followingCount,
  panel,
}: FollowTabsProps) {
  const router = useRouter();

  function handleTabChange(value: string) {
    router.replace(`${basePath}?tab=${value}`, { scroll: false });
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

      <div className="mt-4">{panel}</div>
    </Tabs>
  );
}
