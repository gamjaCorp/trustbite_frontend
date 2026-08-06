'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/core/modal';
import { useImagePreview } from '@/hooks/use-image-preview';
import { NICKNAME_MIN, NICKNAME_MAX } from '@/lib/domain/profile';
import type { MyProfileResponse } from '@/types/user';
import { EditProfileForm } from './edit-profile-form';
import { updateMyProfile } from '../../actions';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: MyProfileResponse;
}

// 프로필 편집 다이얼로그
export function EditProfileDialog(props: Props) {
  // 열 때마다 draft를 초기화한다
  return <EditProfileModal key={String(props.open)} {...props} />;
}

function EditProfileModal({ open, onOpenChange, profile }: Props) {
  const {
    previewUrl: draftAvatarUrl,
    handleFileChange,
    revokePending,
  } = useImagePreview(profile.picture ?? undefined);

  const [draftNickname, setDraftNickname] = useState(profile.nickname);

  const trimmedNickname = draftNickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= NICKNAME_MIN && trimmedNickname.length <= NICKNAME_MAX;
  const hasChanged =
    trimmedNickname !== profile.nickname || draftAvatarUrl !== profile.picture;
  const canSave = isNicknameValid && hasChanged;

  const handleSave = async () => {
    if (!canSave) return;
    try {
      await updateMyProfile(trimmedNickname, draftAvatarUrl);
      onOpenChange(false);
      toast.success('프로필이 변경되었어요');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '프로필 변경중 문제가 생겼어요');
    }
  };

  const handleCancel = () => {
    revokePending();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="프로필 편집"
      footer={
        <>
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            저장
          </Button>
        </>
      }
    >
      <EditProfileForm
        profile={profile}
        nickname={draftNickname}
        avatarUrl={draftAvatarUrl}
        onNicknameChange={setDraftNickname}
        onFileChange={handleFileChange}
        onSubmit={handleSave}
        canSubmit={canSave}
      />
    </Modal>
  );
}
