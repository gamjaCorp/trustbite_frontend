'use client';

// 팔로우/팔로잉 중 상태를 토글하는 소형 버튼
import { UserCheck, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFollowMock } from './stores/follow-mock-store';

interface Props {
  targetUserId?: string; // controlled 모드에서는 생략 가능
  isFollowing?: boolean; // 미제공 시 store에서 읽음
  onToggle?: () => void; // 미제공 시 store toggle 호출
  size?: 'sm' | 'md';
}

// 팔로우/팔로잉 토글 버튼 — 낙관적 업데이트로 즉시 상태 전환
export function FollowToggleButton({
  targetUserId,
  isFollowing: controlledFollowing,
  onToggle,
  size = 'sm',
}: Props) {
  const storeFollowing = useFollowMock((s) => s.isFollowing(targetUserId ?? ''));
  const storeToggle = useFollowMock((s) => s.toggle);

  const following = controlledFollowing ?? storeFollowing;
  const handleToggle = onToggle ?? (() => storeToggle(targetUserId ?? ''));

  return (
    <Button
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        handleToggle();
      }}
      className={cn(
        'gap-1.5 rounded-xl shrink-0',
        size === 'sm' ? 'h-10 px-2.5 text-label-3' : 'h-10 px-3 text-label-2',
        following
          ? 'bg-card text-foreground border border-border hover:bg-muted'
          : 'bg-foreground text-background hover:bg-foreground/90',
      )}
    >
      {following ? (
        <>
          <UserCheck className="w-3.5 h-3.5" />
          팔로잉
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          팔로우
        </>
      )}
    </Button>
  );
}
