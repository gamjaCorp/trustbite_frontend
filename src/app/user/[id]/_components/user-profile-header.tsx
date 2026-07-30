// 다른 사용자 프로필 상단 카드 — 이름·등급·팔로워/팔로잉·팔로우 버튼
import { ProfileHeaderCard } from '@/components/common/profile/profile-header-card';
import { UserGradeMark } from '@/components/common/trust/user-grade-mark';
import { UserAvatar } from '@/components/core/user-avatar';
import { FollowToggleButton } from '@/components/features/follow/follow-toggle-button';
import type { UserProfile, MutualFollowing } from '@/types/user';

interface Props {
  profile: UserProfile;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

// 다른 유저 프로필 헤더 — 아바타·닉네임·팔로우 버튼 + 팔로워/팔로잉 수
export function UserProfileHeader({ profile, isFollowing, onToggleFollow }: Props) {
  // Fix: 유저 이메일 필요
  const handle = 'user';
  const curatedCount = 0;
  // Fix: 맞팔로잉 미리보기 데이터 필요 — 백엔드 미제공, 임시로 렌더 안 함(hasMutualFollowing 고정 false)
  const hasMutualFollowing = false;
  const mutualFollowing: MutualFollowing = { displayName: '', extraCount: 0 };

  return (
    <ProfileHeaderCard
      avatarInitial={profile.nickname[0]}
      title={
        <>
          <h1 className="text-title-1 text-foreground truncate">{profile.nickname}</h1>
          <UserGradeMark name={profile.grade} size="sm" showLabel />
        </>
      }
      subtitle={`@${handle} · 검증된 맛집 ${curatedCount}곳`}
      rightAction={
        <>
          <FollowToggleButton isFollowing={isFollowing} onToggle={onToggleFollow} size="md" />
          {/* TODO: 1차 MVP 제외 — 더보기(신고·차단 등) 액션 미정의 */}
        </>
      }
      followerCount={profile.followerCount}
      followingCount={profile.followingCount}
      followStatsSize="md"
      followersHref={`/user/${profile.userId}/followers`}
      followingHref={`/user/${profile.userId}/following`}
      bottomRight={
        hasMutualFollowing ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <UserAvatar initial={mutualFollowing.displayName[0]} size="xs" />
            <span className="text-caption-2 text-muted-foreground">
              <span className="font-semibold text-foreground">{mutualFollowing.displayName}</span>
              {' 외 내 팔로잉 '}
              <span className="font-semibold text-foreground">{mutualFollowing.extraCount}</span>
              명도 팔로우 중
            </span>
          </div>
        ) : undefined
      }
    />
  );
}
