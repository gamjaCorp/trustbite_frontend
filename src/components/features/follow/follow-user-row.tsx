// 팔로워/팔로잉 목록의 유저 한 행 — 아바타·이름·등급·신뢰도·팔로우 버튼
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserGradeMark } from '@/components/common/user-grade-mark';
import { TrustScoreBadge } from '@/components/common/trust-score-badge';
import type { FollowedUser } from '@/types/follow';

import { FollowToggleButton } from './follow-toggle-button';

interface Props {
  user: FollowedUser;
  hideFollowAction?: boolean;
}

export function FollowUserRow({ user, hideFollowAction = false }: Props) {
  return (
    <li className="border-b border-border last:border-0">
      <Link
        href={`/user/${user.id}`}
        className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
      >
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary-subtle text-primary text-title-3">
            {user.avatarInitial}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-body-1 font-semibold text-foreground truncate">{user.name}</span>
            <UserGradeMark level={user.level} size="sm" showLabel />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-caption-2 text-muted-foreground truncate">@{user.handle}</span>
            {user.bio && (
              <>
                <span className="text-caption-2 text-muted-foreground">·</span>
                <span className="text-caption-2 text-muted-foreground truncate">{user.bio}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <TrustScoreBadge score={user.trustScore} size="sm" />
          {!hideFollowAction && <FollowToggleButton targetUserId={user.id} />}
        </div>
      </Link>
    </li>
  );
}
