'use client';

import { useTransition, useOptimistic } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FollowTabKey } from '@/types/follow';

interface FollowTabsProps {
  initialTab: FollowTabKey; // 현재 활성 탭 — 서버가 ?tab= 쿼리로 계산해 내려준 값
  basePath: string; // 탭 전환 시 ?tab= 쿼리를 붙여 이동할 경로
  followersCount: number; // 팔로워 수 배지
  followingCount: number; // 팔로잉 수 배지
  panel: React.ReactNode; // 현재 탭의 목록 (server 렌더)
}

// 팔로워·팔로잉 탭 셸 — 클릭 즉시 탭이 낙관적으로 전환되고, 서버 응답이 오면 initialTab으로 정착한다
export function FollowTabs({
  initialTab,
  basePath,
  followersCount,
  followingCount,
  panel,
}: FollowTabsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setOptimisticTab] = useOptimistic(initialTab);

  function handleTabChange(value: string) {
    const tabType = value === 'following' ? 'following' : 'followers';
    startTransition(() => {
      setOptimisticTab(tabType);
      router.replace(`${basePath}?tab=${value}`, { scroll: false });
    });
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
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

      <div className={cn('mt-4 transition-opacity', isPending && 'opacity-60')}>{panel}</div>
    </Tabs>
  );
}
