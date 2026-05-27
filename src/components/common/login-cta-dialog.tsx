'use client';

import { Lock } from 'lucide-react';
import { ConfirmDialog } from '@/components/common/confirm-dialog';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  callbackPath: string;
  description?: string;
}

// 비로그인 사용자의 리뷰/북마크 인터랙션에서 띄우는 로그인 유도 다이얼로그
export function LoginCtaDialog({
  open,
  onOpenChange,
  callbackPath,
  description = '로그인하면 모든 리뷰를 볼 수 있어요',
}: Props) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={<Lock className="w-7 h-7 text-primary" />}
      iconTone="primary"
      title="로그인이 필요해요"
      description={description}
      primaryAction={{
        label: '로그인하기',
        href: `/signin?callbackUrl=${encodeURIComponent(callbackPath)}`,
      }}
      secondaryAction={{ label: '나중에' }}
    />
  );
}
