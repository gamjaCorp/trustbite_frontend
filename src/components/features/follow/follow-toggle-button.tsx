'use client';

// 팔로우/팔로잉 중 상태를 토글하는 소형 버튼
import { UserCheck, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFollowMock } from '@/stores/follow-mock-store';

interface Props {
  targetUserId: string;
  size?: 'sm' | 'md';
}

export function FollowToggleButton({ targetUserId, size = 'sm' }: Props) {
  const isFollowing = useFollowMock((s) => s.isFollowing(targetUserId));
  const toggle = useFollowMock((s) => s.toggle);

  return (
    <Button
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        toggle(targetUserId);
      }}
      className={cn(
        'gap-1 rounded-xl shrink-0',
        size === 'sm' ? 'h-7 px-2.5 text-label-3' : 'h-8 px-3 text-label-2',
        isFollowing
          ? 'bg-card text-foreground border border-border hover:bg-muted'
          : 'bg-foreground text-background hover:bg-foreground/90',
      )}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-3 h-3" />
          팔로잉
        </>
      ) : (
        <>
          <UserPlus className="w-3 h-3" />
          팔로우
        </>
      )}
    </Button>
  );
}
