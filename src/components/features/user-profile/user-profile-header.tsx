// 다른 사용자 프로필 상단 카드 — 이름·등급·팔로워/팔로잉·팔로우 버튼
import { useRouter } from 'next/navigation';
import { UserCheck, UserPlus } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProfileHeaderCard } from '@/components/common/profile-header-card';
import { UserGradeMark } from '@/components/common/user-grade-mark';
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
    <ProfileHeaderCard
      avatarInitial={profile.name[0]}
      title={
        <>
          <h1 className="text-title-1 text-foreground truncate">
            {profile.name}님의 미식 가이드
          </h1>
          <UserGradeMark level={profile.level} size="sm" showLabel />
        </>
      }
      subtitle={`@${profile.handle} · 검증된 맛집 ${profile.curatedCount}곳`}
      rightAction={
        <>
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
          {/* TODO: 1차 MVP 제외 — 더보기(신고·차단 등) 액션 미정의 */}
        </>
      }
      followerCount={profile.followerCount}
      followingCount={profile.followingCount}
      followStatsSize="md"
      onClickFollowers={() => router.push(`/user/${profile.id}/followers`)}
      onClickFollowing={() => router.push(`/user/${profile.id}/following`)}
      bottomRight={
        profile.mutualFollowing ? (
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
        ) : undefined
      }
    />
  );
}
