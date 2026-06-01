'use client';

// 내 프로필 편집 다이얼로그 (닉네임 + 아바타 이미지)
import { useState, useRef, useCallback } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMyProfileMock } from '@/stores/my-profile-mock-store';
import type { MyProfile } from '@/lib/types/user/type';

const NICKNAME_MIN = 2;
const NICKNAME_MAX = 12;

interface FormProps {
  profile: MyProfile;
  initialNickname: string;
  initialAvatarUrl?: string;
  onSave: (nickname: string, avatarUrl: string | undefined) => void;
  onCancel: () => void;
}

function EditProfileForm({
  profile,
  initialNickname,
  initialAvatarUrl,
  onSave,
  onCancel,
}: FormProps) {
  const [draftNickname, setDraftNickname] = useState(initialNickname);
  const [draftAvatarUrl, setDraftAvatarUrl] = useState<string | undefined>(initialAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingBlobRef = useRef<string | undefined>(undefined);

  const revokePending = useCallback(() => {
    if (pendingBlobRef.current) {
      URL.revokeObjectURL(pendingBlobRef.current);
      pendingBlobRef.current = undefined;
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    revokePending();
    const url = URL.createObjectURL(file);
    pendingBlobRef.current = url;
    setDraftAvatarUrl(url);
    e.target.value = '';
  };

  const isNicknameValid =
    draftNickname.trim().length >= NICKNAME_MIN &&
    draftNickname.trim().length <= NICKNAME_MAX;

  const hasChanged =
    draftNickname.trim() !== initialNickname || draftAvatarUrl !== initialAvatarUrl;

  const handleSave = () => {
    if (!isNicknameValid) return;
    pendingBlobRef.current = undefined;
    onSave(draftNickname.trim(), draftAvatarUrl);
  };

  const handleCancel = () => {
    revokePending();
    onCancel();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6 py-2">
        <div className="relative">
          <Avatar className="h-20 w-20">
            {draftAvatarUrl && (
              <AvatarImage src={draftAvatarUrl} alt="프로필 이미지 미리보기" />
            )}
            <AvatarFallback className="bg-primary-subtle text-primary text-2xl">
              {profile.avatarInitial}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="프로필 이미지 변경"
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center ring-2 ring-background hover:bg-foreground/80 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: MyProfile;
}

export function EditProfileDialog({ open, onOpenChange, profile }: Props) {
  const { nickname, avatarUrl, setNickname, setAvatarUrl } = useMyProfileMock();

  const handleSave = (newNickname: string, newAvatarUrl: string | undefined) => {
    setNickname(newNickname);
    setAvatarUrl(newAvatarUrl);
    onOpenChange(false);
    toast.success('프로필이 변경되었어요');
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
            initialNickname={nickname}
            initialAvatarUrl={avatarUrl}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
