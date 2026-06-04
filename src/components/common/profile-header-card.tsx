'use client';

// 프로필 헤더 카드 공통 셸 — /profile, /user/[id]에서 공유
import type { ReactNode } from 'react';

import { UserAvatar } from '@/components/core/user-avatar';
import { Surface } from './surface';
import { FollowStatsRow } from './follow-stats-row';

interface Props {
  avatarInitial: string;
  avatarUrl?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  rightAction?: ReactNode;
  followerCount: number;
  followingCount: number;
  followStatsSize?: 'sm' | 'md';
  onClickFollowers: () => void;
  onClickFollowing: () => void;
  bottomRight?: ReactNode;
}

export function ProfileHeaderCard({
  avatarInitial,
  avatarUrl,
  title,
  subtitle,
  rightAction,
  followerCount,
  followingCount,
  followStatsSize = 'md',
  onClickFollowers,
  onClickFollowing,
  bottomRight,
}: Props) {
  return (
    <Surface as="section" variant="bordered" padding="none" className="px-8 py-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <UserAvatar initial={avatarInitial} imageUrl={avatarUrl} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">{title}</div>
            {subtitle && (
              <p className="text-caption-2 text-muted-foreground mt-1 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {rightAction && <div className="shrink-0">{rightAction}</div>}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3 flex-wrap">
        <FollowStatsRow
          followerCount={followerCount}
          followingCount={followingCount}
          size={followStatsSize}
          onClickFollowers={onClickFollowers}
          onClickFollowing={onClickFollowing}
        />
        {bottomRight}
      </div>
    </Surface>
  );
}
