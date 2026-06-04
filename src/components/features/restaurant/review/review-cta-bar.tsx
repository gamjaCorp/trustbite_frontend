'use client';

import Link from 'next/link';
import { PencilLine } from 'lucide-react';

import { MyReview } from '@/lib/types/restaurant';
import { LoginCtaDialog } from '@/components/common/login-cta-dialog';
import { useAuthGatedAction } from '@/hooks/use-auth-gated-action';

interface Props {
  restaurantId: string;
  myReview?: MyReview;
}

// 상세 페이지 하단 리뷰 작성 CTA 바 (비로그인 시 로그인 유도)
export function ReviewCtaBar({ restaurantId, myReview }: Props) {
  const { trigger, dialogProps, isAuthed } = useAuthGatedAction({
    action: () => {},
    callbackPath: `/restaurant/${restaurantId}/review/new`,
    description: '로그인하면 리뷰를 쓰고 신뢰도를 쌓을 수 있어요',
  });
  const isRevisit = Boolean(myReview);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 px-6 py-4">
        <div className="min-w-0 leading-snug">
          {/* TODO: 1차 MVP 제외 — 포인트 카피 (+5pt) 제거 (포인트 시스템 3차 MVP) */}
          {isRevisit && myReview ? (
            <>
              <p className="text-title-1 text-foreground">또 다녀오셨나요?</p>
              <p className="mt-1 text-caption-2 text-muted-foreground">
                <span className="font-semibold">{myReview.visitCount}번</span> 방문 · 최근{' '}
                {myReview.lastVisitLabel} · 재방문 리뷰는 신뢰도에 반영됩니다
              </p>
            </>
          ) : (
            <p className="text-caption-2 text-muted-foreground">
              리뷰를 쓰면 내 신뢰도에 반영됩니다
            </p>
          )}
        </div>

        {isAuthed ? (
          <Link
            href={`/restaurant/${restaurantId}/review/new`}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-title-1 text-primary-foreground hover:brightness-95 active:scale-95 transition-all"
          >
            <PencilLine className="w-4 h-4" />
            {isRevisit ? '재방문 리뷰 쓰기' : '리뷰 쓰기'}
          </Link>
        ) : (
          <button
            type="button"
            onClick={trigger}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-title-1 text-primary-foreground hover:brightness-95 active:scale-95 transition-all"
          >
            <PencilLine className="w-4 h-4" />
            리뷰 쓰기
          </button>
        )}
      </div>

      <LoginCtaDialog {...dialogProps} />
    </div>
  );
}
