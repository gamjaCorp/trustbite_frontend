'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MyReview, MyReviewEntry } from '@/types/restaurant';

interface Props {
  review: MyReview;
}

const CLAMP_THRESHOLD = 120;

function MyReviewPhotos({ photos }: { photos: string[] }) {
  const shown = photos.slice(0, 3);
  const hiddenCount = Math.max(0, photos.length - 3);

  return (
    <div className="mt-3 grid grid-cols-3 gap-2 max-w-md">
      {shown.map((src, i) => {
        const isOverlay = i === shown.length - 1 && hiddenCount > 0;
        return (
          <div key={src} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            <Image
              src={src}
              alt={`내 리뷰 사진 ${i + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 150px, 30vw"
            />
            {isOverlay && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-background font-bold text-xl">+{hiddenCount}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MyReviewVisit({
  visit,
  compact,
}: {
  visit: MyReviewEntry;
  compact: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = compact && visit.content.length > CLAMP_THRESHOLD;
  const isClamped = needsClamp && !expanded;

  return (
    <div className="rounded-xl bg-background p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-foreground">{visit.label}</p>
        <button
          type="button"
          className="shrink-0 w-7 h-7 -mt-1 -mr-1 rounded-full text-muted-foreground hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="수정/삭제"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs text-ink/70 mb-2">
        <span>
          맛{' '}
          <span className="font-numeric font-semibold text-foreground">
            {visit.scores.taste.toFixed(1)}
          </span>
        </span>
        <span>
          가성비{' '}
          <span className="font-numeric font-semibold text-foreground">
            {visit.scores.value.toFixed(1)}
          </span>
        </span>
        <span>
          분위기{' '}
          <span className="font-numeric font-semibold text-foreground">
            {visit.scores.vibe.toFixed(1)}
          </span>
        </span>
      </div>

      <p
        className={cn(
          'whitespace-pre-line text-sm text-foreground leading-relaxed',
          isClamped && 'line-clamp-3',
        )}
      >
        {visit.content}
      </p>

      {needsClamp && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? '접기' : '…더보기'}
        </button>
      )}

      {visit.photos && visit.photos.length > 0 && <MyReviewPhotos photos={visit.photos} />}

      {visit.sceneTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visit.sceneTags.map((tag) => (
            <span
              key={tag}
              className="rounded-chip bg-muted px-2 py-0.5 text-xs text-ink/70"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function MyReviewSection({ review }: Props) {
  const hasMultiple = review.visits.length >= 2;

  return (
    <section className="mx-6 mt-3 rounded-2xl bg-primary-subtle ring-1 ring-primary/20 p-4">
      <header className="flex items-center gap-1.5 pb-3 border-b border-primary/15 mb-3">
        <Bookmark className="w-4 h-4 fill-primary text-primary" />
        <span className="text-sm font-semibold text-foreground">내 리뷰</span>
      </header>

      <div
        className={cn(
          hasMultiple
            ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
            : 'flex flex-col',
        )}
      >
        {review.visits.map((visit) => (
          <MyReviewVisit key={visit.label} visit={visit} compact={hasMultiple} />
        ))}
      </div>
    </section>
  );
}
