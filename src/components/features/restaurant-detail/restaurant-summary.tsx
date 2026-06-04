'use client';

import { Bookmark, Phone, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RestaurantDetail } from '@/lib/types/restaurant';
import { useWishlistMock } from '@/stores/wishlist-mock-store';
import { IconButton } from '@/components/core/icon-button';
import { LoginCtaDialog } from '@/components/common/login-cta-dialog';
import { useAuthGatedAction } from '@/hooks/use-auth-gated-action';

interface Props {
  detail: RestaurantDetail;
}

// 식당 상세 페이지 헤더 요약 — 이름, 카테고리, 공유/북마크 버튼
export function RestaurantSummary({ detail }: Props) {
  const bookmarked = useWishlistMock((s) => s.isBookmarked(detail.id));
  const toggle = useWishlistMock((s) => s.toggle);
  const { trigger, dialogProps, isAuthed } = useAuthGatedAction({
    action: () => toggle(detail.id),
    callbackPath: `/restaurant/${detail.id}`,
  });

  const categoryLine = [
    detail.categoryGroupName,
    detail.subCategory,
    detail.region,
  ].filter(Boolean).join(' · ');

  const addressLine = [
    detail.roadAddress || detail.address,
    detail.hours.weekday,
  ].filter(Boolean).join(' · ');

  return (
    <>
    <section className="px-6 pt-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {categoryLine && (
            <p className="text-caption-2 text-muted-foreground">{categoryLine}</p>
          )}
          <h1 className="mt-1 text-headline-1 text-foreground">{detail.name}</h1>
          {addressLine && (
            <p className="mt-1.5 text-caption-1 text-muted-foreground">{addressLine}</p>
          )}
          {detail.phone && (
            <a
              href={`tel:${detail.phone}`}
              className="mt-1.5 inline-flex items-center gap-1 text-caption-1 text-primary hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              {detail.phone}
            </a>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* TODO: 1차 MVP 제외 — 공유 기능 */}
          <IconButton icon={Share2} aria-label="공유" disabled />
          <IconButton
            icon={Bookmark}
            aria-label="북마크"
            active={bookmarked && isAuthed}
            iconClassName={cn(bookmarked && isAuthed && 'fill-current')}
            onClick={trigger}
          />
        </div>
      </div>
    </section>

    <LoginCtaDialog {...dialogProps} />
    </>
  );
}
