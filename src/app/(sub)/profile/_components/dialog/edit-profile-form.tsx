'use client';

// 프로필 편집 폼
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { useImagePreview } from '@/hooks/use-image-preview';
import type { MyProfileResponse } from '@/types/user';
import { NICKNAME_MIN, NICKNAME_MAX } from '@/lib/domain/profile';
import { AvatarEditField } from './avatar-edit-field';

interface Props {
  profile: MyProfileResponse;
  onSave: (nickname: string, avatarUrl: string | undefined) => void;
  onCancel: () => void;
}

export function EditProfileForm({ profile, onSave, onCancel }: Props) {
  const {
    previewUrl: draftAvatarUrl,
    handleFileChange,
    revokePending,
  } = useImagePreview(profile.picture ?? undefined);

  const [draftNickname, setDraftNickname] = useState(profile?.nickname);

  const isNicknameValid =
    draftNickname.trim().length >= NICKNAME_MIN && draftNickname.trim().length <= NICKNAME_MAX;

  const hasChanged =
    draftNickname.trim() !== profile?.nickname || draftAvatarUrl !== profile?.picture;

  const handleSave = () => {
    if (!isNicknameValid) return;
    onSave(draftNickname.trim(), draftAvatarUrl);
  };

  const handleCancel = () => {
    revokePending();
    onCancel();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6 py-2">
        <AvatarEditField
          initial={profile.nickname?.slice(0, 1) ?? '?'}
          imageUrl={draftAvatarUrl}
          onFileChange={handleFileChange}
        />

        <div className="w-full space-y-2">
          <Label htmlFor="edit-nickname">닉네임</Label>
          <Input
            id="edit-nickname"
            value={draftNickname}
            onChange={(e) => setDraftNickname(e.target.value)}
            maxLength={NICKNAME_MAX}
            placeholder="2~12자"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isNicknameValid && hasChanged) handleSave();
            }}
          />
          <p className="text-caption-2 text-muted-foreground text-right">
            {draftNickname.trim().length}/{NICKNAME_MAX}자
          </p>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleCancel}>
          취소
        </Button>
        <Button onClick={handleSave} disabled={!isNicknameValid || !hasChanged}>
          저장
        </Button>
      </DialogFooter>
    </>
  );
}
