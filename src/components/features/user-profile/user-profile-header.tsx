// 다른 사용자 프로필 상단 카드 — 이름·등급·팔로워/팔로잉·팔로우 버튼
import { useRouter } from 'next/navigation';
import { MoreHorizontal, UserCheck, UserPlus } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserGradeMark } from '@/components/common/user-grade-mark';
import { FollowStatsRow } from '@/components/common/follow-stats-row';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/user';

interface Props {
  profile: UserProfile;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export function UserProfileHeader({ profile, isFollowing, onToggleFollow }: Props) {
  const router = useRouter();
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarFallback className="bg-primary-subtle text-primary text-title-2">
            {profile.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5">
            <h1 className="text-title-1 text-foreground truncate">
              {profile.name}님의 미식 가이드
            </h1>
            <UserGradeMark level={profile.level} size="sm" />
          </div>
          <p className="mt-1 text-caption-2 text-muted-foreground truncate">
            @{profile.handle} · 검증된 맛집 {profile.curatedCount}곳
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            onClick={onToggleFollow}
            className={cn(
              'gap-1.5 rounded-xl',
              isFollowing
                ? 'bg-card text-foreground border border-border hover:bg-muted'
                : 'bg-foreground text-background hover:bg-foreground/90',
            )}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                팔로잉 중
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                팔로우
              </>
            )}
          </Button>
          <button
            type="button"
            aria-label="더보기"
            className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <FollowStatsRow
          followerCount={profile.followerCount}
          followingCount={profile.followingCount}
          size="sm"
          onClickFollowers={() => router.push(`/user/${profile.id}/followers`)}
          onClickFollowing={() => router.push(`/user/${profile.id}/following`)}
        />

        {profile.mutualFollowing && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-primary-subtle text-primary text-label-3">
                {profile.mutualFollowing.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-caption-2 text-muted-foreground">
              <span className="font-semibold text-foreground">
                {profile.mutualFollowing.displayName}
              </span>
              {' 외 내 팔로잉 '}
              <span className="font-semibold text-foreground">
                {profile.mutualFollowing.extraCount}
              </span>
              명도 팔로우 중
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
