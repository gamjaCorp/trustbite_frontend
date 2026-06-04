'use client';

import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/core/confirm-dialog';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

// 리뷰 삭제 확인 다이얼로그
export function DeleteReviewDialog({ open, onOpenChange }: Props) {
  const handleDelete = () => {
    onOpenChange(false);
    // TODO: 1차 MVP 제외 — API 연동 시 실제 mutation으로 교체
    toast.success('리뷰가 삭제되었어요');
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="리뷰를 삭제할까요?"
      description="삭제된 리뷰는 복구할 수 없어요."
      primaryAction={{
        label: '삭제하기',
        onClick: handleDelete,
        tone: 'destructive',
      }}
      secondaryAction={{ label: '취소' }}
    />
  );
}
