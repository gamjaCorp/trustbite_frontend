'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Bookmark, PencilLine, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getRankMedalClasses } from '@/lib/rank';
import { RegionalRankEntry } from '@/types/restaurant';
import { useAuthMock } from '@/stores/auth-mock-store';
import { useWishlistMock } from '@/stores/wishlist-mock-store';
import { TrustScoreBadge } from '@/components/common/trust-score-badge';
import { TrustScoreSheet } from '@/components/common/trust-score-sheet';
import { CategoryBadge } from '@/components/common/category-badge';
import { LoginCtaDialog } from '@/components/features/auth/login-cta-dialog';

interface Props {
  entry: RegionalRankEntry;
  active?: boolean;
  showVisitStats?: boolean;
  hideBookmark?: boolean;
  hideReviewCta?: boolean;
  hideTrustScore?: boolean;
}

export function RegionalRankCard({ entry, active = false, showVisitStats = false, hideBookmark = false, hideReviewCta = false, hideTrustScore = false }: Props) {
  const {
    id,
    rank,
    name,
    category,
    region,
    imageUrl,
    comment,
    avgScore,
    communityAvgScore,
    myStatus,
    trustScore,
    trustBreakdown,
    reviewCount,
    visitCount,
    lastVisitedAt,
  } = entry;

  const { isAuthed } = useAuthMock();
  const bookmarked = useWishlistMock((s) => s.isBookmarked(id));
  const toggleWishlist = useWishlistMock((s) => s.toggle);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div
        data-restaurant-id={id}
        className={cn(
          'group relative flex items-center gap-3 pl-3 pr-3 py-4 scroll-mt-[180px] transition-colors sm:gap-4 sm:pl-4 sm:pr-4',
          'hover:bg-muted/30',
          active && 'bg-primary-subtle/40',
        )}
      >
        {/* ① 랭크 배지 — 1=금/2=은/3=동, 4위~는 옅은 톤 */}
        <div
          className={cn(
            'shrink-0 self-center w-7 h-7 rounded-full flex items-center justify-center text-title-3 sm:w-8 sm:h-8 sm:text-title-2',
            getRankMedalClasses(rank) ?? 'bg-paper-edge text-ink/70',
          )}
          aria-label={`${rank}위`}
        >
          {rank}
        </div>

        {/* ② 이미지 + 북마크 오버레이 */}
        <div className="relative w-20 h-20 shrink-0 sm:w-24 sm:h-24">
          <Link
            href={`/restaurant/${id}`}
            className="relative block w-full h-full overflow-hidden rounded-xl"
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {!hideBookmark && (
            <button
              type="button"
              onClick={() => {
                if (!isAuthed) { setDialogOpen(true); return; }
                toggleWishlist(id);
              }}
              className={cn(
                'absolute top-1.5 right-1 w-9 h-9 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm',
                bookmarked && isAuthed
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background/85 text-ink/70 hover:bg-background',
              )}
              aria-label="북마크"
            >
              <Bookmark className={cn('w-4 h-4', bookmarked && isAuthed && 'fill-current')} />
            </button>
          )}
        </div>

        {/* ③ 가운데 — meta / 이름 / 코멘트 / CTA */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-1 text-caption-1 text-ink/70">
              <div className="flex items-center gap-1 min-w-0">
                <CategoryBadge category={category} />
                <span className="truncate">· {region}</span>
              </div>
              <span className="sm:hidden flex items-center gap-0.5 shrink-0">
                <Star className="w-3 h-3 fill-palette-amber text-palette-amber" aria-hidden />
                <span>{communityAvgScore.toFixed(1)}</span>
              </span>
            </div>
            {showVisitStats && (
              <span className="text-caption-2 text-muted-foreground" suppressHydrationWarning>
                {visitCount}번 · {formatDistanceToNow(lastVisitedAt, { addSuffix: true, locale: ko })}
              </span>
            )}
          </div>

          <Link
            href={`/restaurant/${id}`}
            className="text-title-1 text-foreground truncate"
          >
            {name}
          </Link>

          {comment && (
            <p className="text-caption-1 text-ink/70 line-clamp-1">
              &ldquo;{comment}&rdquo;
            </p>
          )}

          {/* 댓글 수 + 리뷰 CTA 한 줄 */}
          {!hideReviewCta && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1 text-caption-2 text-muted-foreground">
                <MessageSquare className="w-3.5 h-3.5" aria-hidden />
                <span>{reviewCount}</span>
              </div>

              {myStatus !== 'reviewed' ? (
                <Link
                  href={`/restaurant/${id}/review/new`}
                  className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
                >
                  <PencilLine className="w-3 h-3" aria-hidden />
                  리뷰 쓰기
                </Link>
              ) : (
                <Link
                  href={`/restaurant/${id}/review/new`}
                  className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
                >
                  <Star className="w-3 h-3 fill-primary text-primary" aria-hidden />
                  내 평점 {avgScore.toFixed(1)} · 수정
                </Link>
              )}
            </div>
          )}
        </div>

        {/* 수직 구분선 */}
        <div className="hidden sm:block self-stretch w-px bg-border" />

        {/* ④ 우측 — 평균 라벨 + 평점 + (선택)신뢰도 */}
        <div className="hidden sm:flex shrink-0 flex-col items-end gap-0.5 self-center px-3 sm:px-4">
          <span className="text-caption-2 text-muted-foreground">평균</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-palette-amber text-palette-amber" />
            <span className="text-headline-2 text-foreground">
              {communityAvgScore.toFixed(1)}
            </span>
          </div>
          {!hideTrustScore && (
            <TrustScoreBadge
              score={trustScore}
              size="sm"
              onClick={() => setSheetOpen(true)}
            />
          )}
        </div>
      </div>

      {!hideTrustScore && (
        <TrustScoreSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          restaurantName={name}
          trustScore={trustScore}
          breakdown={trustBreakdown}
          reviewCount={reviewCount}
        />
      )}
      {!hideBookmark && (
        <LoginCtaDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          callbackPath={`/restaurant/${id}`}
          description="로그인하면 맛집을 저장할 수 있어요"
        />
      )}
    </>
  );
}
