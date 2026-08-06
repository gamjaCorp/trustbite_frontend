'use client';

import { Lock } from 'lucide-react';
import { Modal } from '@/components/core/modal';

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
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      align="center"
      size="md"
      icon={<Lock />}
      title="로그인이 필요해요"
      primaryAction={{
        label: '로그인하기',
        href: `/signin?callbackUrl=${encodeURIComponent(callbackPath)}`,
      }}
      secondaryAction={{ label: '나중에' }}
    >
      <p className="py-1 text-center text-body-2 text-muted-foreground">{description}</p>
    </Modal>
  );
}
