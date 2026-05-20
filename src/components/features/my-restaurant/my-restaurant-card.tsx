'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Calendar, Repeat, Users, SquarePen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getRankMedalClasses } from '@/lib/rank';
import { CategoryBadge } from '@/components/common/category-badge';
import type { RegionalRankEntry } from '@/types/restaurant';

const SCORE_LABELS: [keyof RegionalRankEntry['scores'], string, string][] = [
  ['taste', '맛', 'text-muted-foreground'],
  ['value', '가성비', 'text-muted-foreground'],
  ['vibe', '분위기', 'text-muted-foreground'],
];

interface Props {
  entry: RegionalRankEntry;
}

// 나의 맛집 전용 랭킹 카드 — 내 평점·세부 점수(맛/가성비/분위기)·방문 정보(시간/횟수/상황) 표시
export function MyRestaurantCard({ entry }: Props) {
  const {
    id,
    rank,
    name,
    category,
    region,
    imageUrl,
    comment,
    scores,
    avgScore,
    visitCount,
    lastVisitedAt,
    myLatestScene,
  } = entry;

  return (
    <div
      data-restaurant-id={id}
      className="group relative flex items-center gap-3 pl-3 pr-2 py-4 scroll-mt-[180px] transition-colors hover:bg-muted/30 sm:gap-4 sm:pl-4 sm:pr-2"
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

      {/* ② 이미지 */}
      <Link
        href={`/restaurant/${id}`}
        className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl sm:w-24 sm:h-24"
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* ③ 중앙 컬럼 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-1 text-caption-1 text-ink/70">
          <div className="flex items-center gap-1 min-w-0">
            <CategoryBadge category={category} />
            <span className="truncate">· {region}</span>
          </div>
          <span className="sm:hidden flex items-center gap-0.5 shrink-0">
            <Star className="w-3 h-3 fill-palette-amber text-palette-amber" aria-hidden />
            <span>{avgScore.toFixed(1)}</span>
          </span>
        </div>

        <Link href={`/restaurant/${id}`} className="text-title-1 text-foreground truncate mt-1">
          {name}
        </Link>

        {comment && (
          <p className="text-caption-1 text-ink/70 line-clamp-1 mb-1">&ldquo;{comment}&rdquo;</p>
        )}

        {/* 세부 점수 행 */}
        <div className="flex items-center gap-3 flex-wrap text-caption-2">
          {SCORE_LABELS.map(([key, label, labelClass]) => (
            <span key={key} className="flex items-center gap-1">
              <span className={labelClass}>{label}</span>
              <span className="text-foreground font-medium">{scores[key].toFixed(1)}</span>
            </span>
          ))}
        </div>

        {/* 방문 정보 행 — 수정 링크 우측 정렬 */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2.5 text-caption-2 text-muted-foreground min-w-0">
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <Calendar className="w-3.5 h-3.5" aria-hidden />
              {formatDistanceToNow(lastVisitedAt, { addSuffix: true, locale: ko })}
            </span>
            <span className={cn('flex items-center gap-1', visitCount >= 3 && 'text-palette-amber')}>
              <Repeat className="w-3.5 h-3.5" aria-hidden />
              {visitCount}번째
            </span>
            {myLatestScene && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" aria-hidden />
                {myLatestScene}
              </span>
            )}
          </div>
          <Link
            href={`/restaurant/${id}/review/new?mode=edit`}
            className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
          >
            <SquarePen className="w-3 h-3" aria-hidden />
            수정
          </Link>
        </div>
      </div>

      {/* ④ 수직 구분선 */}
      <div className="hidden sm:block self-stretch w-px bg-border" />

      {/* ⑤ 내 평점 컬럼 */}
      <div className="hidden sm:flex shrink-0 flex-col items-end gap-1 px-3 sm:px-4 self-center">
        <span className="text-caption-2 text-muted-foreground">내 평점</span>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-palette-amber text-palette-amber" />
          <span className="text-headline-2 text-foreground">{avgScore.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
