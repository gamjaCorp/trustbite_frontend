'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetailedReview } from '@/types/restaurant';

interface Props {
  review: DetailedReview;
}

const CLAMP_THRESHOLD = 120;

export function ReviewCard({ review }: Props) {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = review.content.length > CLAMP_THRESHOLD;
  const isClamped = needsClamp && !expanded;

  return (
    <article className="px-6 py-4 border-t border-border first:border-t-0">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Link
            href={`/user/${review.reviewerId}`}
            className="shrink-0 w-10 h-10 rounded-full bg-primary-subtle text-primary font-bold flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {review.reviewerInitial}
          </Link>
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-1.5">
              <Link
                href={`/user/${review.reviewerId}`}
                className="text-title-2 text-foreground hover:text-primary transition-colors"
              >
                {review.reviewerName}
              </Link>
              <span className="rounded-chip bg-primary/10 text-primary px-1.5 py-0.5 text-label-3">
                Lv.{review.reviewerLevel} {review.reviewerTitle}
              </span>
              <span className="rounded-chip bg-blue-50 text-blue-700 px-1.5 py-0.5 text-label-3 dark:bg-blue-900/30 dark:text-blue-300">
                {review.visitOrdinal}번째 방문
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              신뢰도 {review.reviewerTrustScore}%
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{review.postedAt}</span>
      </header>

      <div className="mt-2.5 flex items-center gap-3 text-xs text-ink/70">
        <span>
          맛 <span className="font-numeric font-semibold text-foreground">{review.scores.taste.toFixed(1)}</span>
        </span>
        <span>
          가성비 <span className="font-numeric font-semibold text-foreground">{review.scores.value.toFixed(1)}</span>
        </span>
        <span>
          분위기 <span className="font-numeric font-semibold text-foreground">{review.scores.vibe.toFixed(1)}</span>
        </span>
      </div>

      <p
        className={cn(
          'mt-2.5 whitespace-pre-line text-sm text-foreground leading-relaxed',
          isClamped && 'line-clamp-3',
        )}
      >
        {review.content}
      </p>

      {needsClamp && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-label-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? '접기' : '…더보기'}
        </button>
      )}

      {review.photos && review.photos.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 max-w-md">
          {review.photos.slice(0, 3).map((src, i) => (
            <div key={src} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <Image
                src={src}
                alt={`리뷰 사진 ${i + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 150px, 30vw"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center flex-wrap gap-1.5">
        {review.sceneTags.map((tag) => (
          <span
            key={tag}
            className="rounded-chip bg-muted px-2 py-0.5 text-xs text-ink/70"
          >
            #{tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink/70 hover:bg-muted transition-colors"
      >
        <ThumbsUp className="w-3 h-3" />
        도움됐어요 <span className="font-numeric">{review.helpfulCount}</span>
      </button>
    </article>
  );
}
