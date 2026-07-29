import Link from 'next/link';
import { ChevronRight, Eye } from 'lucide-react';
import { ProfileHeaderCard } from '@/components/common/profile/profile-header-card';
import { UserGradeMark } from '@/components/common/trust/user-grade-mark';
import { EditProfileButton } from './edit-profile-button';
import { gradeNameToLevel } from '@/lib/domain/grade-levels';
import type { MyProfileResponse } from '@/types/user';

interface Props {
  profile: MyProfileResponse;
  sessionName?: string;
  sessionImage?: string;
}

// 내 프로필 요약 카드 (아바타, 닉네임, 팔로우 통계) — server component
export function ProfileSummaryCard({ profile, sessionName, sessionImage }: Props) {
  const createdDate = new Date(profile.createdAt);
  const joinedAt = `${createdDate.getFullYear()}.${String(createdDate.getMonth() + 1).padStart(2, '0')} 가입`;
  const name = profile?.nickname ?? sessionName;

  return (
    <ProfileHeaderCard
      avatarInitial={name.slice(0, 1) ?? '?'}
      avatarUrl={sessionImage}
      title={
        <>
          <span className="text-title-1 text-foreground truncate">{name}</span>
          <UserGradeMark level={gradeNameToLevel(profile.grade)} size="sm" showLabel />
        </>
      }
      subtitle={`${profile.email}  ${profile.createdAt ? `· ${joinedAt}` : ''}`}
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
