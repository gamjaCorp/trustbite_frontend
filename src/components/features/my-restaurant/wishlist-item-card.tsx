'use client';

// 위시리스트 항목 카드 — 북마크 토글·썸네일·카테고리·태그라인·메타·커뮤니티 평점·신뢰도 표시
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Clock, MessageSquare, PencilLine, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CategoryBadge } from '@/components/common/category-badge';
import { TrustScoreBadge } from '@/components/common/trust-score-badge';
import type { RestaurantDetail } from '@/types/restaurant';

interface Props {
  detail: RestaurantDetail;
  addedAt: string;
  onRemove: (id: string) => void;
}

// 위시리스트 항목 카드 — 북마크 토글·썸네일·카테고리·태그라인·메타·커뮤니티 평점 표시
export function WishlistItemCard({ detail, addedAt, onRemove }: Props) {
  const {
    id,
    name,
    category,
    region,
    tagline,
    photos,
    communityAvgScore,
    trustScore,
    reviewCount,
  } = detail;

  const thumbnail =
    photos[0] ??
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&auto=format';

  return (
    <div className="flex items-stretch gap-3 px-3 py-4 group hover:bg-muted/30 transition-colors sm:gap-4">
      {/* 북마크 토글 — 클릭하면 위시리스트에서 해제 */}
      <button
        type="button"
        onClick={() => onRemove(id)}
        aria-label="북마크 해제"
        className="shrink-0 self-center w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
      >
        <Bookmark className="w-5 h-5 fill-current" />
      </button>

      {/* 썸네일 */}
      <Link
        href={`/restaurant/${id}`}
        className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl sm:w-24 sm:h-24"
      >
        <Image
          src={thumbnail}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* 중앙 컬럼 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-1 text-caption-1 text-muted-foreground">
          <div className="flex items-center gap-1 min-w-0">
            <CategoryBadge category={category} />
            <span className="truncate">· {region}</span>
          </div>
          <span className="sm:hidden flex items-center gap-0.5 shrink-0">
            <Star className="w-3 h-3 fill-palette-amber text-palette-amber" aria-hidden />
            <span>{communityAvgScore.toFixed(1)}</span>
          </span>
        </div>

        <Link href={`/restaurant/${id}`} className="text-title-1 text-foreground truncate">
          {name}
        </Link>

        {tagline && (
          <p className="text-caption-1 text-muted-foreground line-clamp-1 italic mb-1">&ldquo;{tagline}&rdquo;</p>
        )}

        {/* 메타 행 */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div
            className="flex items-center gap-2.5 text-caption-2 text-muted-foreground min-w-0"
            suppressHydrationWarning
          >
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden />
              {formatDistanceToNow(new Date(addedAt), { addSuffix: true, locale: ko })} 저장
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" aria-hidden />
              {reviewCount}
            </span>
          </div>
          <Link
            href={`/restaurant/${id}/review/new`}
            className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
          >
            <PencilLine className="w-3 h-3" aria-hidden />
            리뷰 쓰기
          </Link>
        </div>
      </div>

      {/* 수직 구분선 */}
      <div className="hidden sm:block self-stretch w-px bg-border" />

      {/* 우측 — 커뮤니티 평점 + 신뢰도 */}
      <div className="hidden sm:flex shrink-0 flex-col items-end gap-1 px-3 sm:px-4 self-center">
        <span className="text-caption-2 text-muted-foreground">평균</span>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-palette-amber text-palette-amber" />
          <span className="text-headline-2 text-foreground">{communityAvgScore.toFixed(1)}</span>
        </div>
        <TrustScoreBadge score={trustScore} size="sm" showIcon={false} />
      </div>
    </div>
  );
}
