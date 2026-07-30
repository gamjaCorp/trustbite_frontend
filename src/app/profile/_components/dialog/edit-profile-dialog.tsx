'use client';

import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { MyProfileResponse } from '@/types/user';
import { EditProfileForm } from './edit-profile-form';
import { updateMyProfile } from '../../actions';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: MyProfileResponse;
}

// 프로필 편집 다이얼로그
export function EditProfileDialog({ open, onOpenChange, profile }: Props) {
  const handleSave = async (newNickname: string, newAvatarUrl?: string | undefined) => {
    try {
      await updateMyProfile(newNickname, newAvatarUrl);
      onOpenChange(false);
      toast.success('프로필이 변경되었어요');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '프로필 변경중 문제가 생겼어요');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
        </DialogHeader>
        {open && (
          <EditProfileForm
            profile={profile}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
