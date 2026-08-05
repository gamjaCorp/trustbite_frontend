'use client';

// place-list-row variant별 하단 섹션 컴포넌트 — MyFooter / RegionalFooter / WishlistFooter
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  PencilLine,
  MessageSquare,
  Calendar,
  Repeat,
  Users,
  SquarePen,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { SCORE_LABELS } from '@/lib/domain/score-labels';
import type { RatingScores, SceneTag, VisitStatus } from '@/types/restaurant';

// my variant 하단 — 세부 점수 + 방문 정보 + 수정 링크
export function MyFooter({
  id,
  scores,
  lastVisitedAt,
  visitCount,
  myLatestScene,
  ownerName,
}: {
  id: string;
  scores?: RatingScores;
  lastVisitedAt?: Date | string;
  visitCount?: number;
  myLatestScene?: SceneTag;
  ownerName?: string;
}) {
  return (
    <>
      {scores && (
        <div className="flex items-center gap-3 flex-wrap text-caption-2">
          {SCORE_LABELS.map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground font-medium tabular-nums">{scores[key].toFixed(1)}</span>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2.5 text-caption-2 text-muted-foreground min-w-0">
          {lastVisitedAt != null && (
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <Calendar className="w-3.5 h-3.5" aria-hidden />
              {formatDistanceToNow(new Date(lastVisitedAt as Date), { addSuffix: true, locale: ko })}
            </span>
          )}
          {visitCount != null && (
            <span className={cn('flex items-center gap-1', visitCount >= 3 && 'text-warning')}>
              <Repeat className="w-3.5 h-3.5" aria-hidden />
              {visitCount}번째
            </span>
          )}
          {myLatestScene && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" aria-hidden />
              {myLatestScene}
            </span>
          )}
        </div>
        {!ownerName && (
          <Link
            href={`/review?restaurantId=${id}&mode=edit`}
            className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
          >
            <SquarePen className="w-3 h-3" aria-hidden />
            수정
          </Link>
        )}
      </div>
    </>
  );
}

// regional variant 하단 — 리뷰수 + 리뷰 작성/수정 CTA
export function RegionalFooter({
  id,
  name,
  reviewCount,
  minimal,
  myStatus,
  myAvgScore,
}: {
  id: string;
  name: string;
  reviewCount?: number;
  minimal: boolean;
  myStatus?: VisitStatus;
  myAvgScore?: number;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between gap-2 pt-2">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); router.push(`/restaurant/${id}`); }}
        className="flex items-center gap-1 text-caption-2 text-muted-foreground cursor-pointer hover:underline bg-transparent p-0"
        aria-label={`${name} 리뷰 보기`}
      >
        <MessageSquare className="w-3.5 h-3.5" aria-hidden />
        <span>{minimal ? 0 : reviewCount}</span>
      </button>
      {!minimal && myStatus === 'reviewed' ? (
        <Link
          href={`/review?restaurantId=${id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
        >
          <Star className="w-3 h-3 fill-primary text-primary" aria-hidden />
          내 평점 {myAvgScore?.toFixed(1)} · 수정
        </Link>
      ) : (
        <Link
          href="/review"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
        >
          <PencilLine className="w-3 h-3" aria-hidden />
          리뷰 쓰기
        </Link>
      )}
    </div>
  );
}

// wishlist variant 하단 — 저장 시점 + 리뷰수 + 리뷰 작성 CTA
export function WishlistFooter({
  id,
  name,
  addedAt,
  reviewCount,
}: {
  id: string;
  name: string;
  addedAt?: string;
  reviewCount?: number;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between gap-2 min-w-0">
      <div className="flex items-center gap-2.5 text-caption-2 text-muted-foreground min-w-0" suppressHydrationWarning>
        {addedAt && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden />
            {formatDistanceToNow(new Date(addedAt), { addSuffix: true, locale: ko })} 저장
          </span>
        )}
        {reviewCount != null && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); router.push(`/restaurant/${id}`); }}
            className="flex items-center gap-1 cursor-pointer hover:underline bg-transparent p-0"
            aria-label={`${name} 리뷰 보기`}
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden />
            {reviewCount}
          </button>
        )}
      </div>
      <Link
        href="/review"
        className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
      >
        <PencilLine className="w-3 h-3" aria-hidden />
        리뷰 쓰기
      </Link>
    </div>
  );
}
