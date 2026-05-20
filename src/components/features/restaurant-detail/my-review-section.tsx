'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MyReview, MyReviewEntry } from '@/types/restaurant';
import { useAuthMock } from '@/stores/auth-mock-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteReviewDialog } from './delete-review-dialog';

interface Props {
  review: MyReview;
  restaurantId: string;
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
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <span className="text-background text-headline-2">+{hiddenCount}</span>
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
  restaurantId,
}: {
  visit: MyReviewEntry;
  compact: boolean;
  restaurantId: string;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const needsClamp = compact && visit.content.length > CLAMP_THRESHOLD;
  const isClamped = needsClamp && !expanded;

  const handleEdit = () => {
    router.push(`/restaurant/${restaurantId}/review/new?mode=edit`);
  };

  return (
    <div className="rounded-xl bg-background p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {visit.visitOrdinal > 1 && (
            <span className="rounded-chip bg-palette-blue-subtle text-info px-1.5 py-0.5 text-label-3">
              {visit.visitOrdinal}번째 방문
            </span>
          )}
          <span className="text-caption-2 text-muted-foreground">{visit.dateLabel}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="shrink-0 w-7 h-7 -mt-1 -mr-1 rounded-full text-muted-foreground hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="수정/삭제"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={handleEdit}>
              <Pencil className="w-4 h-4" />
              수정하기
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setConfirmOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              삭제하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3 text-body-2 text-ink/70 mb-2">
        <span>
          맛{' '}
          <span className="font-semibold text-foreground">
            {visit.scores.taste.toFixed(1)}
          </span>
        </span>
        <span>
          가성비{' '}
          <span className="font-semibold text-foreground">
            {visit.scores.value.toFixed(1)}
          </span>
        </span>
        <span>
          분위기{' '}
          <span className="font-semibold text-foreground">
            {visit.scores.vibe.toFixed(1)}
          </span>
        </span>
      </div>

      <p
        className={cn(
          'whitespace-pre-line text-body-2 text-foreground/85 leading-relaxed',
          isClamped && 'line-clamp-3',
        )}
      >
        {visit.content}
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

      {visit.photos && visit.photos.length > 0 && <MyReviewPhotos photos={visit.photos} />}

      {visit.sceneTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visit.sceneTags.map((tag) => (
            <span
              key={tag}
              className="rounded-chip bg-muted px-2 py-0.5 text-label-3 text-ink/70"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <DeleteReviewDialog open={confirmOpen} onOpenChange={setConfirmOpen} />
    </div>
  );
}

export function MyReviewSection({ review, restaurantId }: Props) {
  const { isAuthed } = useAuthMock();
  if (!isAuthed) return null;

  const hasMultiple = review.visits.length >= 2;

  return (
    <section className="px-6 pt-10">
      <h2 className="text-headline-2 text-foreground mb-3">내 리뷰</h2>

      <div
        className={cn(
          'rounded-2xl bg-primary-subtle ring-1 ring-primary/20 p-4',
          hasMultiple
            ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
            : 'flex flex-col',
        )}
      >
        {review.visits.map((visit) => (
          <MyReviewVisit
            key={`${visit.visitOrdinal}-${visit.dateLabel}`}
            visit={visit}
            compact={hasMultiple}
            restaurantId={restaurantId}
          />
        ))}
      </div>
    </section>
  );
}
