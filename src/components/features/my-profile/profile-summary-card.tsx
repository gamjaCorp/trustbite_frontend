'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProfileHeaderCard } from '@/components/common/profile-header-card';
import { UserGradeMark } from '@/components/common/user-grade-mark';
import { useMyProfileMock } from '@/stores/my-profile-mock-store';
import { EditProfileDialog } from './edit-profile-dialog';
import type { MyProfile } from '@/types/user';

interface Props {
  profile: MyProfile;
}

// 내 프로필 요약 카드 (아바타, 닉네임, 팔로우 통계)
export function ProfileSummaryCard({ profile }: Props) {
  const router = useRouter();
  const { nickname, avatarUrl } = useMyProfileMock();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <ProfileHeaderCard
        avatarInitial={profile.avatarInitial}
        avatarUrl={avatarUrl}
        title={
          <>
            <span className="text-title-1 text-foreground truncate">{nickname}</span>
            <UserGradeMark level={profile.level} size="sm" showLabel />
          </>
        }
        subtitle={`${profile.email} · ${profile.joinedAt}`}
        rightAction={
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full"
            onClick={() => setIsEditOpen(true)}
          >
            편집
          </Button>
        }
        followerCount={profile.followerCount}
        followingCount={profile.followingCount}
        onClickFollowers={() => router.push('/profile/followers')}
        onClickFollowing={() => router.push('/profile/following')}
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
      <EditProfileDialog open={isEditOpen} onOpenChange={setIsEditOpen} profile={profile} />
    </>
  );
}
