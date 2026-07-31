// 팔로워/팔로잉 목록의 유저 한 행 — 아바타·이름·등급 + 팔로우 버튼
import Link from 'next/link';

import { UserGradeMark } from '@/components/common/trust/user-grade-mark';
import { UserAvatar } from '@/components/core/user-avatar';
import type { FollowedUser } from '@/types/follow';

import { FollowToggleButton } from './follow-toggle-button';

interface Props {
  user: FollowedUser;
  hideFollowAction?: boolean;
}

// 팔로우 목록 단일 행 — 아바타·이름·등급 + 팔로우 토글 버튼
export function FollowUserRow({ user, hideFollowAction = false }: Props) {
  return (
    <li className="border-b border-border last:border-0">
      <Link
        href={`/user/${user.userId}`}
        className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
      >
        <UserAvatar initial={user.nickname[0]} imageUrl={user.picture ?? undefined} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-title-1 text-foreground truncate">{user.nickname}</span>
            <UserGradeMark name={user.grade} size="sm" showLabel />
          </div>
          {/* Fix: 목록 응답에 trustScore·handle·bio 없음 — 백엔드 응답 필요 */}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!hideFollowAction && (
            <FollowToggleButton targetUserId={user.userId} isFollowing={user.following} />
          )}
        </div>
      </Link>
    </li>
  );
}
