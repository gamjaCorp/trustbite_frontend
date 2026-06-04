'use client';

// 편집 버튼 + EditProfileDialog를 캡슐화하는 client island
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditProfileDialog } from './edit-profile-dialog';
import type { MyProfile } from '@/lib/types/user';

interface Props {
  profile: MyProfile;
}

// 프로필 편집 버튼 — 클릭 시 EditProfileDialog 표시 (client island)
export function EditProfileButton({ profile }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 rounded-full"
        onClick={() => setIsOpen(true)}
      >
        편집
      </Button>
      <EditProfileDialog open={isOpen} onOpenChange={setIsOpen} profile={profile} />
    </>
  );
}
