'use client';

// 통합 맛집 리스트 행 — variant(regional/my/wishlist)에 따라 좌측 머리·중앙 본문·우측 평점을 분기 표시
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Bookmark, PencilLine, MessageSquare, Calendar, Repeat, Users, SquarePen, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuthMock } from '@/stores/auth-mock-store';
import { useWishlistMock } from '@/stores/wishlist-mock-store';
import { TrustScoreBadge } from '@/components/common/trust-score-badge';
import { TrustScoreSheet } from '@/components/common/trust-score-sheet';
import { CategoryBadge } from '@/components/common/category-badge';
import { RankMedal } from '@/components/common/rank-medal';
import { ScoreStars } from '@/components/common/score-stars';
import { LoginCtaDialog } from '@/components/features/auth/login-cta-dialog';
import type {
  Category,
  RatingScores,
  SceneTag,
  TrustBreakdown,
  VisitStatus,
  RegionalRankEntry,
  RestaurantDetail,
} from '@/types/restaurant';
import { SCORE_LABELS } from '@/lib/score-labels';
import { formatDistance } from '@/lib/format-distance';

export interface PlaceListRowData {
  id: string;
  name: string;
  category: Category;
  region: string;
  imageUrl: string;
  communityAvgScore?: number;
  myAvgScore?: number;
  rank?: number;
  comment?: string;
  tagline?: string;
  scores?: RatingScores;
  trustScore?: number;
  trustBreakdown?: TrustBreakdown;
  reviewCount?: number;
  visitCount?: number;
  lastVisitedAt?: Date | string;
  myLatestScene?: SceneTag;
  myStatus?: VisitStatus;
  addedAt?: string;
  subCategory?: string;
  distanceMeters?: number;
}

export type PlaceListRowVariant = 'regional' | 'my' | 'wishlist';

interface PlaceListRowProps {
  data: PlaceListRowData;
  variant: PlaceListRowVariant;
  hideBookmark?: boolean;
  hideTrustScore?: boolean;
  hideReviewCta?: boolean;
  showVisitStats?: boolean;
  /** regional variant에서 합성 필드(메달·평점·comment·리뷰수·CTA) 전부 숨김 */
  minimal?: boolean;
  active?: boolean;
  onRemoveFromWishlist?: (id: string) => void;
  // variant="my"에서 타인의 랭킹을 볼 때 — 라벨을 "{name}의 평점"으로, 수정 링크 숨김
  ownerName?: string;
}

export function PlaceListRow({
  data,
  variant,
  hideBookmark = false,
  hideTrustScore = false,
  hideReviewCta = false,
  showVisitStats = false,
  minimal = false,
  active = false,
  onRemoveFromWishlist,
  ownerName,
}: PlaceListRowProps) {
  const {
    id,
    name,
    category,
    region,
    imageUrl,
    communityAvgScore,
    myAvgScore,
    rank,
    comment,
    tagline,
    scores,
    trustScore,
    trustBreakdown,
    reviewCount,
    visitCount,
    lastVisitedAt,
    myLatestScene,
    myStatus,
    addedAt,
    subCategory,
    distanceMeters,
  } = data;

  const { isAuthed } = useAuthMock();
  const bookmarked = useWishlistMock((s) => s.isBookmarked(id));
  const toggleWishlist = useWishlistMock((s) => s.toggle);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const showTrustScore = variant === 'regional' && !hideTrustScore && !minimal;
  const showBookmarkOverlay = variant === 'regional' && !hideBookmark;

  return (
    <>
      <div
        data-restaurant-id={id}
        className={cn(
          'group relative flex items-center gap-3 pl-3 pr-3 py-4 scroll-mt-[180px] transition-colors hover:bg-muted/30 sm:gap-4 sm:pl-4 sm:pr-4',
          active && 'bg-primary-subtle/40',
        )}
      >
        {/* ① 좌측 머리 — wishlist: 큰 북마크 토글 / regional·my: 랭크 메달 (minimal 시 생략) */}
        {variant === 'wishlist' ? (
          <button
            type="button"
            onClick={() => onRemoveFromWishlist?.(id)}
            aria-label="북마크 해제"
            className="shrink-0 self-center w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
          >
            <Bookmark className="w-5 h-5 fill-current" />
          </button>
        ) : !minimal && rank != null ? (
          <RankMedal
            rank={rank}
            fallbackTone="paper"
            className="self-center sm:w-8 sm:h-8 sm:text-title-2"
            aria-label={`${rank}위`}
          />
        ) : null}

        {/* ② 썸네일 + regional 북마크 오버레이 */}
        <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24">
          <Link
            href={`/restaurant/${id}`}
            className="relative block w-full h-full overflow-hidden rounded-xl"
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {showBookmarkOverlay && (
            <button
              type="button"
              onClick={() => {
                if (!isAuthed) { setDialogOpen(true); return; }
                toggleWishlist(id);
              }}
              className={cn(
                'absolute top-1 right-1 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm',
                bookmarked && isAuthed
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background/85 text-ink/70 hover:bg-background',
              )}
              aria-label="북마크"
            >
              <Bookmark className={cn('w-4 h-4', bookmarked && isAuthed && 'fill-current')} />
            </button>
          )}
        </div>

        {/* ③ 중앙 컬럼 */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-1 text-caption-1 text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0">
              <CategoryBadge category={category} />
              <span className="truncate">· {region}</span>
            </div>
            {/* 모바일용 평점 인라인 표시 — minimal 시 신규 칩 */}
            {minimal && variant === 'regional' ? (
              <span className="sm:hidden inline-flex items-center px-2 py-0.5 rounded-chip bg-muted text-muted-foreground text-caption-2 shrink-0">신규</span>
            ) : (variant === 'my' ? myAvgScore : communityAvgScore) != null ? (
              <ScoreStars
                score={(variant === 'my' ? myAvgScore : communityAvgScore)!}
                size="sm"
                className="sm:hidden shrink-0 gap-0.5"
              />
            ) : null}
          </div>

          <Link href={`/restaurant/${id}`} className="text-title-1 text-foreground truncate">
            {name}
          </Link>

          {/* minimal 시 세부 카테고리 + 거리 (Kakao 원본 데이터) */}
          {minimal && variant === 'regional' && (subCategory || distanceMeters != null) && (
            <span className="text-caption-2 text-muted-foreground -mt-0.5 truncate">
              {[subCategory, distanceMeters != null ? formatDistance(distanceMeters) : null]
                .filter(Boolean)
                .join(' · ')}
            </span>
          )}

          {/* regional: 방문 통계 */}
          {variant === 'regional' && showVisitStats && visitCount != null && lastVisitedAt != null && (
            <span className="text-caption-2 text-muted-foreground -mt-0.5" suppressHydrationWarning>
              {visitCount}번 · {formatDistanceToNow(new Date(lastVisitedAt as Date), { addSuffix: true, locale: ko })}
            </span>
          )}

          {/* comment (regional / my) — minimal 시 미노출 */}
          {(variant === 'regional' || variant === 'my') && (
            minimal && variant === 'regional' ? null : comment ? (
              <p className="text-caption-1 text-muted-foreground line-clamp-1 mb-0.5">
                &ldquo;{comment}&rdquo;
              </p>
            ) : null
          )}

          {/* wishlist: tagline */}
          {variant === 'wishlist' && tagline && (
            <p className="text-caption-1 text-muted-foreground line-clamp-1 italic mb-0.5">
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          {/* my: 세부 점수 */}
          {variant === 'my' && scores && (
            <div className="flex items-center gap-3 flex-wrap text-caption-2">
              {SCORE_LABELS.map(({ key, label }) => (
                <span key={key} className="flex items-center gap-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium tabular-nums">{scores[key].toFixed(1)}</span>
                </span>
              ))}
            </div>
          )}

          {/* my: 방문 정보 + 수정 링크 */}
          {variant === 'my' && (
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
                  href={`/restaurant/${id}/review/new?mode=edit`}
                  className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
                >
                  <SquarePen className="w-3 h-3" aria-hidden />
                  수정
                </Link>
              )}
            </div>
          )}

          {/* regional: 리뷰수 + CTA — minimal 시 리뷰수 — placeholder, CTA는 유지 */}
          {variant === 'regional' && !hideReviewCta && (
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1 text-caption-2 text-muted-foreground">
                <MessageSquare className="w-3.5 h-3.5" aria-hidden />
                <span>{minimal ? 0 : reviewCount}</span>
              </div>
              {!minimal && myStatus === 'reviewed' ? (
                <Link
                  href={`/restaurant/${id}/review/new`}
                  className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
                >
                  <Star className="w-3 h-3 fill-primary text-primary" aria-hidden />
                  내 평점 {myAvgScore?.toFixed(1)} · 수정
                </Link>
              ) : (
                <Link
                  href={`/restaurant/${id}/review/new`}
                  className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
                >
                  <PencilLine className="w-3 h-3" aria-hidden />
                  리뷰 쓰기
                </Link>
              )}
            </div>
          )}

          {/* wishlist: 저장 시점 + 리뷰수 + CTA */}
          {variant === 'wishlist' && (
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2.5 text-caption-2 text-muted-foreground min-w-0" suppressHydrationWarning>
                {addedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden />
                    {formatDistanceToNow(new Date(addedAt), { addSuffix: true, locale: ko })} 저장
                  </span>
                )}
                {reviewCount != null && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden />
                    {reviewCount}
                  </span>
                )}
              </div>
              <Link
                href={`/restaurant/${id}/review/new`}
                className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
              >
                <PencilLine className="w-3 h-3" aria-hidden />
                리뷰 쓰기
              </Link>
            </div>
          )}
        </div>

        {/* 수직 구분선 */}
        <div className="hidden sm:block self-stretch w-px bg-border" />

        {/* ④ 우측 평점 컬럼 — minimal 시 — placeholder */}
        <div className="hidden sm:flex shrink-0 flex-col items-end gap-0.5 self-center px-3 sm:px-4">
          <span className="text-caption-2 text-muted-foreground text-right max-w-18 leading-tight">
            {variant === 'my' ? (ownerName ? `${ownerName}의 평점` : '내 평점') : '평균'}
          </span>
          {minimal ? (
            <span className="inline-flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" aria-hidden />
              <span className="text-title-3 text-muted-foreground tabular-nums">–</span>
            </span>
          ) : (variant === 'my' ? myAvgScore : communityAvgScore) != null ? (
            <ScoreStars score={(variant === 'my' ? myAvgScore : communityAvgScore)!} size="lg" />
          ) : null}
          {minimal ? (
            <span className="mt-2 inline-flex items-center justify-center px-2 py-0.5 rounded-chip bg-muted text-muted-foreground text-caption-2">리뷰 부족</span>
          ) : showTrustScore && trustScore != null ? (
            <TrustScoreBadge
              score={trustScore}
              size="sm"
              onClick={() => setSheetOpen(true)}
            />
          ) : null}
          {!minimal && variant === 'wishlist' && trustScore != null && (
            <TrustScoreBadge score={trustScore} size="sm" showIcon={false} />
          )}
        </div>
      </div>

      {/* regional 전용 오버레이 (조건부 hook 금지 — useState는 항상 호출, 렌더만 분기) */}
      {showTrustScore && trustScore != null && trustBreakdown != null && (
        <TrustScoreSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          restaurantName={name}
          trustScore={trustScore}
          breakdown={trustBreakdown}
          reviewCount={reviewCount ?? 0}
        />
      )}
      {showBookmarkOverlay && (
        <LoginCtaDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          callbackPath={`/restaurant/${id}`}
          description="로그인하면 맛집을 저장할 수 있어요"
        />
      )}
    </>
  );
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&auto=format';

export function toPlaceListRowData(entry: RegionalRankEntry): PlaceListRowData {
  return {
    id: entry.id,
    name: entry.name,
    category: entry.category,
    region: entry.region,
    imageUrl: entry.imageUrl,
    communityAvgScore: entry.communityAvgScore,
    myAvgScore: entry.avgScore,
    rank: entry.rank,
    comment: entry.comment,
    scores: entry.scores,
    trustScore: entry.trustScore,
    trustBreakdown: entry.trustBreakdown,
    reviewCount: entry.reviewCount,
    visitCount: entry.visitCount,
    lastVisitedAt: entry.lastVisitedAt,
    myLatestScene: entry.myLatestScene,
    myStatus: entry.myStatus,
    subCategory: entry.subCategory,
    distanceMeters: entry.distanceMeters,
  };
}

export function toPlaceListRowDataFromDetail(
  detail: RestaurantDetail,
  opts: { addedAt: string },
): PlaceListRowData {
  return {
    id: detail.id,
    name: detail.name,
    category: detail.category,
    region: detail.region,
    imageUrl: detail.photos[0] ?? FALLBACK_IMAGE,
    communityAvgScore: detail.communityAvgScore,
    trustScore: detail.trustScore,
    trustBreakdown: detail.trustBreakdown,
    reviewCount: detail.reviewCount,
    tagline: detail.tagline,
    addedAt: opts.addedAt,
  };
}
