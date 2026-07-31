'use client';

import { UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useOptimistic, useTransition } from 'react';
import { toggleFollow } from './actions';

interface Props {
  targetUserId?: number;
  isFollowing: boolean;
  size?: 'sm' | 'md';
}

// 팔로우/팔로잉 토글 버튼 — 낙관적 업데이트로 즉시 상태 전환
export function FollowToggleButton({
  targetUserId,
  isFollowing: controlledFollowing,
  size = 'sm',
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [following, setIsFollowing] = useOptimistic(controlledFollowing);

  const handleToggle = () => {
    if (!targetUserId || controlledFollowing === undefined) return;
    startTransition(async () => {
      setIsFollowing(!following);

      await toggleFollow(targetUserId, controlledFollowing);
    });
  };

  return (
    <Button
      size="sm"
      disabled={isPending}
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
        isPending && 'opacity-60',
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
