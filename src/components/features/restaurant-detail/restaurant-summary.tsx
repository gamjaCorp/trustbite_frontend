'use client';

import { useState } from 'react';
import { Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RestaurantDetail } from '@/types/restaurant';
import { useAuthMock } from '@/stores/auth-mock-store';
import { useWishlistMock } from '@/stores/wishlist-mock-store';
import { LoginCtaDialog } from '@/components/features/auth/login-cta-dialog';

interface Props {
  detail: RestaurantDetail;
}

// 식당 상세 페이지 헤더 요약 — 이름, 카테고리, 공유/북마크 버튼
export function RestaurantSummary({ detail }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAuthed } = useAuthMock();
  const bookmarked = useWishlistMock((s) => s.isBookmarked(detail.id));
  const toggle = useWishlistMock((s) => s.toggle);

  return (
    <>
    <section className="px-6 pt-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-caption-2 text-muted-foreground">
            {detail.category}
            {detail.subCategory ? ` · ${detail.subCategory}` : ''}
          </p>
          <h1 className="mt-1 text-headline-1 text-foreground">{detail.name}</h1>
          <p className="mt-1.5 text-caption-1 text-muted-foreground">
            {detail.address} · {detail.accessSummary} · {detail.hours.weekday}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-muted text-ink/70 hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="공유"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isAuthed) {
                setDialogOpen(true);
              } else {
                toggle(detail.id);
              }
            }}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
              bookmarked && isAuthed
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-ink/70 hover:bg-muted/80',
            )}
            aria-label="북마크"
          >
            <Bookmark className={cn('w-4 h-4', bookmarked && isAuthed && 'fill-current')} />
          </button>
        </div>
      </div>
    </section>

    <LoginCtaDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      callbackPath={`/restaurant/${detail.id}`}
    />
    </>
  );
}
