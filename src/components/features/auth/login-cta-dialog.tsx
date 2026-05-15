'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 gap-0 rounded-3xl overflow-hidden">
        <DialogTitle className="sr-only">로그인 필요</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <div className="px-6 pt-10 pb-8 flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-headline-3 text-foreground">로그인이 필요해요</p>
            <p className="text-body-2 text-muted-foreground">{description}</p>
          </div>
          <div className="w-full flex flex-col gap-2.5">
            <Button asChild className="w-full h-12 text-title-2 rounded-xl">
              <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackPath)}`}>
                로그인하기
              </Link>
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="w-full h-12 text-title-2 rounded-xl text-muted-foreground">
                나중에
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
