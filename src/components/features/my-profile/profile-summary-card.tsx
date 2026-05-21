'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfileHeaderCard } from '@/components/common/profile-header-card';
import { UserGradeMark } from '@/components/common/user-grade-mark';
import { useMyProfileMock } from '@/stores/my-profile-mock-store';
import type { MyProfile } from '@/types/user';

const NICKNAME_MIN = 2;
const NICKNAME_MAX = 12;

interface Props {
  profile: MyProfile;
}

// 내 프로필 요약 카드 (아바타, 닉네임, 팔로우 통계)
export function ProfileSummaryCard({ profile }: Props) {
  const router = useRouter();
  const { nickname, setNickname } = useMyProfileMock();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const isValid = draft.trim().length >= NICKNAME_MIN && draft.trim().length <= NICKNAME_MAX;

  const handleEdit = () => {
    setDraft(nickname);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!isValid) return;
    setNickname(draft);
    setIsEditing(false);
    toast.success('닉네임이 변경되었어요');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const title = isEditing ? (
    <div className="flex items-center gap-2">
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={NICKNAME_MAX}
        className="h-9 w-40 text-title-1"
      />
      <Button
        size="sm"
        className="rounded-full shrink-0"
        disabled={!isValid}
        onClick={handleSave}
      >
        저장
      </Button>
      <Button size="sm" variant="ghost" className="rounded-full shrink-0" onClick={handleCancel}>
        취소
      </Button>
    </div>
  ) : (
    <>
      <span className="text-title-1 text-foreground truncate">{nickname}</span>
      <UserGradeMark level={profile.level} size="sm" showLabel />
    </>
  );

  return (
    <ProfileHeaderCard
      avatarInitial={profile.avatarInitial}
      title={title}
      subtitle={`${profile.email} · ${profile.joinedAt}`}
      rightAction={
        !isEditing ? (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full"
            onClick={handleEdit}
          >
            편집
          </Button>
        ) : undefined
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
  );
}
