import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { MyReview } from '@/types/restaurant';

interface Props {
  restaurantId: string;
  myReview?: MyReview;
}

export function ReviewCtaBar({ restaurantId, myReview }: Props) {
  const isRevisit = Boolean(myReview);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 px-6 py-4">
        <div className="min-w-0 leading-snug">
          {isRevisit && myReview ? (
            <>
              <p className="text-title-1 text-foreground">또 다녀오셨나요?</p>
              <p className="mt-1 text-caption-2 text-muted-foreground">
                <span className="font-numeric font-semibold">{myReview.visitCount}번</span> 방문 · 최근{' '}
                {myReview.lastVisitLabel} · 재방문 리뷰를 쓰면{' '}
                <span className="font-semibold text-primary">+5pt</span>
              </p>
            </>
          ) : (
            <p className="text-caption-2 text-muted-foreground">
              리뷰를 쓰면 <span className="font-semibold text-primary">+5pt</span> 적립 · 내 신뢰도에 반영됩니다
            </p>
          )}
        </div>
        <Link
          href={`/restaurant/${restaurantId}/review/new`}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-title-1 text-primary-foreground hover:brightness-95 active:scale-95 transition-all"
        >
          <PencilLine className="w-4 h-4" />
          {isRevisit ? '재방문 리뷰 쓰기' : '리뷰 쓰기'}
        </Link>
      </div>
    </div>
  );
}
