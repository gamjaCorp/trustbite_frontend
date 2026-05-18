'use client';

// 나의 맛집 전체 랭킹 전용 카드 — 내 평점·세부 점수·방문 정보 표시
import Link from 'next/link';
import Image from 'next/image';
import { Star, Calendar, Repeat, Users, SquarePen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CategoryBadge } from '@/components/common/category-badge';
import type { RegionalRankEntry } from '@/types/restaurant';

const SCORE_LABELS: [keyof RegionalRankEntry['scores'], string][] = [
  ['taste', '맛'],
  ['value', '가성비'],
  ['vibe', '분위기'],
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

  const isTop3 = rank <= 3;

  return (
    <div
      data-restaurant-id={id}
      className="group relative flex items-center gap-4 px-2 py-4 scroll-mt-[180px] transition-colors hover:bg-muted/30"
    >
      {/* ① 랭크 배지 */}
      <div
        className={cn(
          'shrink-0 self-center w-8 h-8 rounded-full flex items-center justify-center text-title-2',
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

      {/* ③ 중앙 컬럼 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-1 text-caption-1 text-ink/70">
          <CategoryBadge category={category} />
          <span>· {region}</span>
        </div>

        <Link href={`/restaurant/${id}`} className="text-title-1 text-foreground truncate">
          {name}
        </Link>

        {comment && (
          <p className="text-caption-1 text-ink/70 line-clamp-1 mb-1">&ldquo;{comment}&rdquo;</p>
        )}

        {/* 세부 점수 행 */}
        <div className="flex items-center gap-3 text-caption-2">
          {SCORE_LABELS.map(([key, label]) => (
            <span key={key} className="flex items-center gap-1">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground">{scores[key].toFixed(1)}</span>
            </span>
          ))}
        </div>

        {/* 방문 정보 행 — 수정 링크 우측 정렬 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 text-caption-2 text-muted-foreground">
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <Calendar className="w-3.5 h-3.5" aria-hidden />
              {formatDistanceToNow(lastVisitedAt, { addSuffix: true, locale: ko })}
            </span>
            <span className="flex items-center gap-1">
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
            href={`/restaurant/${id}/review/new`}
            className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
          >
            <SquarePen className="w-3 h-3" aria-hidden />
            수정
          </Link>
        </div>
      </div>

      {/* 수직 구분선 */}
      <div className="self-stretch w-px bg-border/60" />

      {/* ④ 내 평점 컬럼 */}
      <div className="shrink-0 flex flex-col items-end gap-0.5 px-4">
        <span className="text-caption-2 text-muted-foreground">내 평점</span>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-palette-amber text-palette-amber" />
          <span className="text-headline-2 text-foreground">
            {avgScore.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
