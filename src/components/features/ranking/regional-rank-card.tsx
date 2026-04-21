'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_STYLE } from '@/lib/category';
import { RegionalRankEntry } from '@/types/restaurant';
import { TrustScoreBadge } from '@/components/common/trust-score-badge';
import { TrustScoreSheet } from '@/components/common/trust-score-sheet';

interface Props {
  entry: RegionalRankEntry;
  variant?: 'default' | 'featured' | 'compact';
  active?: boolean;
}

const MEDALS = ['🥇', '🥈', '🥉'];

const RANK_COLORS: Record<number, string> = {
  1: 'text-grade-s',
  2: 'text-grade-a',
  3: 'text-grade-b',
};

export function RegionalRankCard({ entry, variant = 'default', active = false }: Props) {
  const { id, rank, name, category, region, imageUrl, comment, avgScore, communityAvgScore, reviewCount, myStatus, trustScore, trustBreakdown } = entry;
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  const [bookmarked, setBookmarked] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isCompact) {
    return (
      <>
        <div
          data-restaurant-id={id}
          className={cn(
            'group relative bg-card rounded-2xl transition-all duration-200 flex items-stretch gap-4 p-4 scroll-mt-[180px]',
            'hover:shadow-md hover:-translate-y-0.5 shadow-card ring-1 ring-paper-edge/40',
            active && 'ring-2 ring-primary shadow-lg',
          )}
        >
          {/* ① 랭크 번호 */}
          {rank > 3 && (
            <div className="w-8 shrink-0 flex items-center justify-center">
              <span className="font-numeric text-base font-semibold text-ink/60">
                {rank}
              </span>
            </div>
          )}

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
            {rank <= 3 && (
              <span className="absolute bottom-1 left-1 text-base leading-none drop-shadow-md">
                {MEDALS[rank - 1]}
              </span>
            )}
          </Link>

          {/* ③ 가운데 — meta / 이름 / 코멘트 / CTA */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-ink/70">
              <span
                className={cn(
                  'rounded-chip px-2 py-0.5 text-xs font-medium',
                  CATEGORY_STYLE[category],
                )}
              >
                {category}
              </span>
              <span>· {region}</span>
            </div>

            <Link
              href={`/restaurant/${id}`}
              className="font-bold text-base text-foreground truncate"
            >
              {name}
            </Link>

            {comment && (
              <p className="text-sm text-ink/70 line-clamp-1">
                &ldquo;{comment}&rdquo;
              </p>
            )}

            {/* 리뷰 CTA */}
            <div className="pt-1">
              {myStatus !== 'reviewed' ? (
                <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:brightness-90 active:scale-95 transition-all">
                  ✍️ 리뷰 쓰기
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-sm text-ink/60">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span>내 평점 <span className="font-numeric">{avgScore.toFixed(1)}</span></span>
                  <span className="text-ink/40">·</span>
                  <button className="text-ink/70 hover:text-foreground transition-colors">
                    수정
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ④ 우측 — 평점/신뢰도 + 큰 북마크 */}
          <div className="shrink-0 flex items-center gap-2 self-center">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-0.5">
                <Star className="w-4 h-4 fill-grade-s text-grade-s" />
                <span className="font-numeric text-base font-bold text-foreground">
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

  return (
    <div
      data-restaurant-id={id}
      className={cn(
        'bg-card rounded-2xl overflow-hidden transition-all duration-200 flex flex-col scroll-mt-[180px] hover:shadow-lg hover:-translate-y-0.5',
        isFeatured ? 'shadow-md ring-1 ring-border' : 'shadow-card',
        active && 'ring-2 ring-primary shadow-lg',
      )}
    >
      {/* 이미지 */}
      <div className={cn('relative w-full overflow-hidden', isFeatured ? 'aspect-video' : 'aspect-4/3')}>
        <Link href={`/restaurant/${id}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* 북마크 토글 — 이미지 좌상단 */}
        <button
          onClick={() => setBookmarked((v) => !v)}
          className={cn(
            'absolute top-2.5 left-2.5 p-1.5 rounded-full backdrop-blur-sm transition-all active:scale-90',
            bookmarked
              ? 'bg-primary text-primary-foreground'
              : 'bg-black/30 text-white hover:bg-black/50',
          )}
        >
          <Bookmark className={cn('w-4 h-4 transition-transform', bookmarked && 'fill-current scale-110')} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* 메타 (카테고리 · 지역) */}
        <Link href={`/restaurant/${id}`} className="space-y-1.5">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className={cn('rounded-chip px-2 py-0.5 text-xs font-medium', CATEGORY_STYLE[category])}>
              {category}
            </span>
            <span>· {region}</span>
          </div>

          {/* 순위 메달 + 이름 */}
          <div className="flex items-center gap-1.5">
            {rank <= 3 ? (
              <span className="text-xl leading-none shrink-0">{MEDALS[rank - 1]}</span>
            ) : (
              <span className={cn('font-numeric text-base font-semibold shrink-0', RANK_COLORS[rank] ?? 'text-muted-foreground')}>
                {rank}
              </span>
            )}
            <p className="font-bold text-base text-foreground leading-snug truncate">
              {name}
            </p>
          </div>
        </Link>

        {/* 한줄 평가 */}
        {comment && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            &ldquo;{comment}&rdquo;
          </p>
        )}

        {/* 커뮤니티 평점 + 신뢰도 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Star className="w-4 h-4 fill-grade-s text-grade-s shrink-0" />
          <span className="font-numeric text-base font-bold text-foreground">
            {communityAvgScore.toFixed(1)}
          </span>
          <TrustScoreBadge score={trustScore} size="sm" onClick={() => setSheetOpen(true)} />
          <span className="text-sm text-muted-foreground">· 리뷰 {reviewCount.toLocaleString()}</span>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-1">
          {myStatus !== 'reviewed' ? (
            <button className="w-full rounded-xl py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              ✍️ 리뷰 쓰기
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-chip px-2.5 py-1 bg-primary/10 text-primary text-sm font-semibold">
                <Star className="w-3.5 h-3.5 fill-primary" />
                내 평점 <span className="font-numeric">{avgScore.toFixed(1)}</span>
              </span>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                수정 →
              </button>
            </div>
          )}
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
    </div>
  );
}
