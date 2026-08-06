'use client';

import { UserMinus, UserPlus } from 'lucide-react';
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
      variant={following ? 'outline' : 'default'}
      size={size === 'sm' ? 'sm' : 'default'}
      loading={isPending}
      onClick={(e) => {
        e.preventDefault();
        handleToggle();
      }}
      className={cn(following && 'text-muted-foreground')}
    >
      {following ? (
        <>
          <UserMinus />
          언팔로우
        </>
      ) : (
        <>
          <UserPlus />
          팔로우
        </>
      )}
    </Button>
  );
}
