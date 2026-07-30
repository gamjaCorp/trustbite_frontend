'use client';

// 프로필 편집 다이얼로그의 아바타 미리보기 + 이미지 변경 버튼
import { useRef } from 'react';
import { Camera } from 'lucide-react';

import { UserAvatar } from '@/components/core/user-avatar';

interface Props {
  initial: string; // 이미지 없을 때 표시할 이니셜
  imageUrl?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 아바타 편집 필드 — 아바타 미리보기 위에 카메라 버튼을 얹어 파일 선택을 트리거
export function AvatarEditField({ initial, imageUrl, onFileChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <UserAvatar initial={initial} imageUrl={imageUrl} size="xl" />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label="프로필 이미지 변경"
        className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center ring-2 ring-background hover:bg-foreground/80 transition-colors after:absolute after:content-[''] after:-inset-1"
      >
        <Camera className="w-3.5 h-3.5" />
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onFileChange} />
    </div>
  );
}
