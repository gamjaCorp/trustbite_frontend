'use client';

// 위시리스트 항목 카드 — 썸네일, 가게 정보, 리뷰 상태 CTA, 북마크 해제 버튼
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, PencilLine } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { RestaurantDetail } from '@/types/restaurant';

interface Props {
  detail: RestaurantDetail;
  addedAt: string;
  onRemove: (id: string) => void;
}

export function WishlistItemCard({ detail, addedAt, onRemove }: Props) {
  const { id, name, category, subCategory, photos, myReview } = detail;
  const thumbnail = photos[0] ?? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&auto=format';
  const categoryLabel = subCategory ? `${category} · ${subCategory}` : category;
  const addedLabel = formatDistanceToNow(new Date(addedAt), { addSuffix: true, locale: ko });

  const avgScore = myReview
    ? myReview.visits.reduce(
        (sum, v) => sum + (v.scores.taste + v.scores.value + v.scores.vibe) / 3,
        0,
      ) / myReview.visits.length
    : 0;

  return (
    <div className="flex items-center gap-3 py-3 px-1">
      {/* 썸네일 */}
      <Link href={`/restaurant/${id}`} className="relative w-16 h-16 shrink-0 overflow-hidden rounded-xl">
        <Image src={thumbnail} alt={name} fill className="object-cover" />
      </Link>

      {/* 가게 정보 */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Link href={`/restaurant/${id}`} className="text-title-2 text-foreground truncate">
          {name}
        </Link>
        <p className="text-caption-2 text-muted-foreground">{categoryLabel}</p>
        <p className="text-caption-2 text-muted-foreground/60">{addedLabel} 저장</p>
      </div>

      {/* CTA + 해제 */}
      <div className="flex items-center gap-1.5 shrink-0">
        {myReview ? (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-chip border border-primary/40 bg-primary-subtle/40 px-2.5 py-1 text-label-3 text-primary hover:bg-primary-subtle hover:border-primary/60 active:scale-95 transition-all"
          >
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span>
              내 평점 <span className="font-numeric">{avgScore.toFixed(1)}</span>
            </span>
            <span className="text-primary/50">·</span>
            <span>수정</span>
          </button>
        ) : (
          <Link
            href={`/review/new?restaurantId=${id}`}
            className="inline-flex items-center gap-1.5 rounded-chip border border-primary/40 bg-primary-subtle/40 px-2.5 py-1 text-label-3 text-primary hover:bg-primary-subtle hover:border-primary/60 active:scale-95 transition-all"
          >
            <PencilLine className="w-3.5 h-3.5" />
            리뷰 쓰기
          </Link>
        )}
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="북마크 해제"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
