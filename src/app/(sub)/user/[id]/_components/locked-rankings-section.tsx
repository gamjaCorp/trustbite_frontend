import { Lock } from 'lucide-react';

import { FollowToggleButton } from '@/components/common/follow/follow-toggle-button';
import { EmptyState } from '@/components/core/empty-state';

interface Props {
  totalCount: number;
  targetName: string;
  targetUserId: number;
}

// 팔로우 전 랭킹 잠금 상태 — Lock 아이콘 + 팔로우 CTA만 표시
export function LockedRankingsSection({ totalCount, targetName, targetUserId }: Props) {
  return (
    <section className="mt-8 space-y-3">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-title-1 text-foreground">전체 랭킹 {totalCount}곳</h2>
        <span className="text-caption-2 text-muted-foreground">팔로우하면 열람할 수 있어요</span>
      </div>

      {/* TODO: 1차 MVP 제외 — 포인트 차감 카피 (포인트 시스템 3차 MVP) */}
      <EmptyState
        icon={Lock}
        title={`팔로우하고 ${targetName}님의 ${totalCount}곳을 확인해보세요`}
        description="팔로우하면 전체 랭킹이 공개돼요"
        // 이 섹션 자체가 미팔로우 분기(UserRankingsGate)에서만 렌더되므로 항상 false
        cta={<FollowToggleButton targetUserId={targetUserId} isFollowing={false} size="md" />}
        className="rounded-2xl border border-border bg-muted/40 p-7 md:p-7"
      />
    </section>
  );
}
