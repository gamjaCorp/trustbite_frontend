'use client';

// 프로필 헤더 카드 공통 셸 — /profile, /user/[id]에서 공유
import type { ReactNode } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { FollowStatsRow } from './follow-stats-row';

interface Props {
  avatarInitial: string;
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
    <section className="rounded-2xl bg-card border border-border px-8 py-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className="bg-primary-subtle text-primary text-title-1">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
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
    </section>
  );
}
