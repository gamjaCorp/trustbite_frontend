'use client';

// 프로필 편집 폼 필드 — draft 상태는 부모(EditProfileDialog)가 들고 있다
import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MyProfileResponse } from '@/types/user';
import { NICKNAME_MAX } from '@/lib/domain/profile';
import { AvatarEditField } from './avatar-edit-field';

interface Props {
  profile: MyProfileResponse;
  nickname: string;
  avatarUrl?: string; // 미리보기 object URL 또는 기존 사진
  onNicknameChange: (value: string) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  canSubmit: boolean; // Enter로 제출 가능한지
}

export function EditProfileForm({
  profile,
  nickname,
  avatarUrl,
  onNicknameChange,
  onFileChange,
  onSubmit,
  canSubmit,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <AvatarEditField
        initial={profile.nickname?.slice(0, 1) ?? '?'}
        imageUrl={avatarUrl}
        onFileChange={onFileChange}
      />

      <div className="w-full space-y-2">
        <Label htmlFor="edit-nickname">닉네임</Label>
        <Input
          id="edit-nickname"
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          maxLength={NICKNAME_MAX}
          placeholder="2~12자"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSubmit) onSubmit();
          }}
        />
        <p className="text-caption-2 text-muted-foreground text-right">
          {nickname.trim().length}/{NICKNAME_MAX}자
        </p>
      </div>
    </div>
  );
}
