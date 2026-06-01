'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MyReview, MyReviewEntry } from '@/lib/types/restaurant/type';
import { useAuthStatus } from '@/hooks/use-auth-status';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SectionHeader } from '@/components/common/section-header';
import { DeleteReviewDialog } from './delete-review-dialog';
import { DimensionScoreRow } from './dimension-score-row';
import { VisitOrdinalChip } from './visit-ordinal-chip';
import { ReviewBodyClamp } from './review-body-clamp';
import { ReviewPhotoGrid } from './review-photo-grid';
import { SceneTagsRow } from './scene-tags-row';

interface Props {
  review: MyReview;
  restaurantId: string;
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/restaurant/${restaurantId}/review/new?mode=edit`);
  };

  return (
    <div className="rounded-xl bg-background p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <VisitOrdinalChip ordinal={visit.visitOrdinal} />
          <span className="text-caption-2 text-muted-foreground">{visit.dateLabel}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="shrink-0 w-11 h-11 -mt-1 -mr-1 rounded-full text-muted-foreground hover:bg-muted flex items-center justify-center transition-colors"
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

      <DimensionScoreRow scores={visit.scores} className="mb-2" />
      <ReviewBodyClamp content={visit.content} enabled={compact} />

      {visit.photos && visit.photos.length > 0 && (
        <ReviewPhotoGrid photos={visit.photos} showOverflow altPrefix="내 리뷰 사진" />
      )}

      <SceneTagsRow tags={visit.sceneTags} className="mt-3" />

      <DeleteReviewDialog open={confirmOpen} onOpenChange={setConfirmOpen} />
    </div>
  );
}

export function MyReviewSection({ review, restaurantId }: Props) {
  const { isAuthed } = useAuthStatus();
  if (!isAuthed) return null;

  const hasMultiple = review.visits.length >= 2;

  return (
    <section className="px-6 pt-10">
      <SectionHeader title="내 리뷰" className="mb-3" />

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
