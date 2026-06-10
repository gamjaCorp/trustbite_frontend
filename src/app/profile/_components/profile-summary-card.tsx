import Link from 'next/link';
import { ChevronRight, Eye } from 'lucide-react';

import { ProfileHeaderCard } from '@/components/common/profile/profile-header-card';
import { UserGradeMark } from '@/components/common/trust/user-grade-mark';
import { EditProfileButton } from './edit-profile-button';
import type { MyProfile } from '@/lib/types/user';

interface Props {
  profile: MyProfile;
  sessionName?: string; // auth()에서 읽은 세션 닉네임
  sessionImage?: string; // auth()에서 읽은 세션 아바타 URL
}

// 내 프로필 요약 카드 (아바타, 닉네임, 팔로우 통계) — server component
export function ProfileSummaryCard({ profile, sessionName, sessionImage }: Props) {
  return (
    <ProfileHeaderCard
      avatarInitial={sessionName?.slice(0, 1) ?? '?'}
      avatarUrl={sessionImage}
      title={
        <>
          <span className="text-title-1 text-foreground truncate">{sessionName}</span>
          <UserGradeMark level={profile.level} size="sm" showLabel />
        </>
      }
      subtitle={`${profile.email} · ${profile.joinedAt}`}
      rightAction={<EditProfileButton profile={profile} />}
      followerCount={profile.followerCount}
      followingCount={profile.followingCount}
      followersHref="/profile/followers"
      followingHref="/profile/following"
      bottomRight={
        <Link
          href="/my-places"
          className="inline-flex items-center gap-1 text-label-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>내 미식 가이드 보기</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      }
    />
  );
}
