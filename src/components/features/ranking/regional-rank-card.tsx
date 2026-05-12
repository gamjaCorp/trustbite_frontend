'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Bookmark, PencilLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_STYLE } from '@/lib/category';
import { RegionalRankEntry } from '@/types/restaurant';
import { TrustScoreBadge } from '@/components/core/trust-score-badge';
import { TrustScoreSheet } from '@/components/core/trust-score-sheet';

interface Props {
  entry: RegionalRankEntry;
  active?: boolean;
}

export function RegionalRankCard({ entry, active = false }: Props) {
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
  } = entry;

  const [bookmarked, setBookmarked] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isTop3 = rank <= 3;

  return (
    <>
      <div
        data-restaurant-id={id}
        className={cn(
          'group relative flex items-stretch gap-4 px-2 py-4 scroll-mt-[180px] transition-colors',
          'hover:bg-muted/30',
          active && 'bg-primary-subtle/40',
        )}
      >
        {/* ① 랭크 배지 — 1~3위는 primary 채움, 4위~는 옅은 톤 */}
        <div
          className={cn(
            'shrink-0 self-center w-8 h-8 rounded-full flex items-center justify-center font-numeric text-title-2',
            isTop3 ? 'bg-primary text-primary-foreground' : 'bg-paper-edge text-ink/70',
          )}
          aria-label={`${rank}위`}
        >
          {rank}
        </div>

        {/* ② 이미지 */}
        <Link
          href={`/restaurant/${id}`}
          className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl"
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* ③ 가운데 — meta / 이름 / 코멘트 / CTA */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center gap-1 text-sm text-ink/70">
            <span
              className={cn(
                'rounded-chip px-2 py-0.5 text-label-3',
                CATEGORY_STYLE[category],
              )}
            >
              {category}
            </span>
            <span>· {region}</span>
          </div>

          <Link
            href={`/restaurant/${id}`}
            className="text-title-1 text-foreground truncate"
          >
            {name}
          </Link>

          {comment && (
            <p className="text-sm text-ink/70 line-clamp-1">
              &ldquo;{comment}&rdquo;
            </p>
          )}

          {/* 리뷰 CTA — primary 아웃라인 칩 */}
          <div className="pt-1">
            {myStatus !== 'reviewed' ? (
              <Link
                href={`/restaurant/${id}/review/new`}
                className="inline-flex items-center gap-1.5 rounded-chip border border-primary/40 bg-primary-subtle/40 px-2.5 py-1 text-label-3 text-primary hover:bg-primary-subtle hover:border-primary/60 active:scale-95 transition-all"
              >
                <PencilLine className="w-3.5 h-3.5" />
                리뷰 쓰기
              </Link>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-chip border border-primary/40 bg-primary-subtle/40 px-2.5 py-1 text-label-3 text-primary hover:bg-primary-subtle hover:border-primary/60 active:scale-95 transition-all"
              >
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span>
                  내 평점 <span className="font-numeric">{avgScore.toFixed(1)}</span>
                </span>
                <span className="text-primary/50">·</span>
                <span>수정</span>
              </button>
            )}
          </div>
        </div>

        {/* ④ 우측 — 평점/신뢰도 + 큰 북마크 */}
        <div className="shrink-0 flex items-center gap-2 self-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-0.5">
              <Star className="w-4 h-4 fill-grade-s text-grade-s" />
              <span className="font-numeric text-title-1 text-foreground">
                {communityAvgScore.toFixed(1)}
              </span>
            </div>
            <TrustScoreBadge
              score={trustScore}
              size="sm"
              onClick={() => setSheetOpen(true)}
            />
          </div>

          <button
            onClick={() => setBookmarked((v) => !v)}
            className={cn(
              'shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90',
              bookmarked
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-ink/50 hover:bg-muted/80 hover:text-ink/80',
            )}
            aria-label="북마크"
          >
            <Bookmark className={cn('w-5 h-5', bookmarked && 'fill-current')} />
          </button>
        </div>
      </div>

      <TrustScoreSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        restaurantName={name}
        trustScore={trustScore}
        breakdown={trustBreakdown}
        reviewCount={reviewCount}
      />
    </>
  );
}
