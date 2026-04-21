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
            'group relative bg-card rounded-2xl overflow-hidden transition-all duration-200 flex scroll-mt-[180px]',
            'hover:shadow-md hover:-translate-y-0.5 shadow-card ring-1 ring-paper-edge/40',
            active && 'ring-2 ring-primary shadow-lg',
          )}
        >
          <Link href={`/restaurant/${id}`} className="relative w-24 h-auto shrink-0 overflow-hidden">
            <Image src={imageUrl} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            {rank <= 3 && (
              <span className="absolute bottom-1 left-1 text-base leading-none drop-shadow-md">
                {MEDALS[rank - 1]}
              </span>
            )}
          </Link>

          <div className="flex-1 min-w-0 p-3 flex flex-col gap-1.5">
            <Link href={`/restaurant/${id}`} className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {rank > 3 && (
                    <span className="font-numeric text-[11px] font-semibold text-ink/60 shrink-0">
                      {String(rank).padStart(2, '0')}
                    </span>
                  )}
                  <p className="font-bold text-sm text-foreground leading-snug truncate">{name}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-ink/70 pt-0.5">
                  <span className={cn('rounded-chip px-1.5 py-0.5 text-[10px] font-medium', CATEGORY_STYLE[category])}>
                    {category}
                  </span>
                  <span>· {region}</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); setBookmarked((v) => !v); }}
                className={cn(
                  'shrink-0 p-1 rounded-full transition-all active:scale-90',
                  bookmarked ? 'text-primary' : 'text-ink/40 hover:text-ink/70',
                )}
              >
                <Bookmark className={cn('w-4 h-4', bookmarked && 'fill-current')} />
              </button>
            </Link>

            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-grade-s text-grade-s" />
                <span className="font-numeric text-sm font-bold text-foreground">{communityAvgScore.toFixed(1)}</span>
              </div>
              <TrustScoreBadge score={trustScore} size="sm" onClick={() => setSheetOpen(true)} />
              <span className="font-numeric text-[10px] text-ink/60">
                리뷰 {reviewCount.toLocaleString()}
              </span>
            </div>

            {comment && (
              <p className="text-[11px] text-ink/70 line-clamp-1 border-l-2 border-primary/30 pl-2 italic mt-0.5">
                &ldquo;{comment}&rdquo;
              </p>
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
        {/* 순위 + 이름 + 카테고리 */}
        <Link href={`/restaurant/${id}`} className="space-y-1">
          <div className="flex items-center gap-2">
            {rank <= 3 ? (
              <span className={cn('leading-none shrink-0', isFeatured ? 'text-2xl' : 'text-xl')}>
                {MEDALS[rank - 1]}
              </span>
            ) : (
              <span className={cn('text-sm font-bold w-6 shrink-0', RANK_COLORS[rank] ?? 'text-muted-foreground')}>
                {rank}위
              </span>
            )}
            <p className={cn('font-bold text-foreground leading-snug truncate', isFeatured ? 'text-base' : 'text-sm')}>
              {name}
            </p>
          </div>
          <div className="flex items-center gap-1.5 pl-0.5">
            <span className={cn('text-xs rounded-chip px-1.5 py-0.5', CATEGORY_STYLE[category])}>
              {category}
            </span>
            <span className="text-xs text-muted-foreground">· {region}</span>
          </div>
        </Link>

        {/* 한줄 평가 */}
        {comment && (
          <p className="text-xs text-muted-foreground italic line-clamp-1 border-l-2 border-primary/30 pl-2">
            &ldquo;{comment}&rdquo;
          </p>
        )}

        {/* 커뮤니티 평점 + 신뢰도 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Star className={cn('fill-grade-s text-grade-s shrink-0', isFeatured ? 'w-5 h-5' : 'w-4 h-4')} />
          <span className={cn('font-bold', isFeatured ? 'text-lg' : 'text-base')}>{communityAvgScore.toFixed(1)}</span>
          <TrustScoreBadge score={trustScore} size={isFeatured ? 'md' : 'sm'} onClick={() => setSheetOpen(true)} />
          <span className="text-xs text-muted-foreground">· 리뷰 {reviewCount.toLocaleString()}개</span>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-1">
          {myStatus !== 'reviewed' ? (
            <button className="w-full rounded-xl py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              ✍️ 리뷰 쓰기
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 rounded-chip px-2.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-primary" />
                내 평점 {avgScore.toFixed(1)}
              </span>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
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
