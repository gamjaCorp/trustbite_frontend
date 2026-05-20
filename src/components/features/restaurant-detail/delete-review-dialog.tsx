'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 gap-0 rounded-3xl overflow-hidden">
        <DialogTitle className="sr-only">리뷰 삭제</DialogTitle>
        <DialogDescription className="sr-only">리뷰를 삭제하시겠어요?</DialogDescription>

        <div className="px-6 pt-8 pb-6 flex flex-col gap-6">
          <div className="text-center space-y-1.5">
            <p className="text-headline-3 text-foreground">리뷰를 삭제할까요?</p>
            <p className="text-body-2 text-muted-foreground">삭제된 리뷰는 복구할 수 없어요.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button
              variant="destructive"
              className="w-full h-12 text-title-2 rounded-xl"
              onClick={handleDelete}
            >
              삭제하기
            </Button>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="w-full h-12 text-title-2 rounded-xl text-muted-foreground"
              >
                취소
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
