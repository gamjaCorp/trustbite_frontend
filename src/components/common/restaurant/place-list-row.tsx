'use client';

// 통합 맛집 리스트 행 — variant(regional/my/wishlist)에 따라 좌측 머리·중앙 본문·우측 평점을 분기 표시
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Bookmark, PencilLine, MessageSquare, Calendar, Repeat, Users, SquarePen, Clock, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useWishlistMock } from '@/stores/wishlist-mock-store';
import { useAuthGatedAction } from '@/hooks/use-auth-gated-action';
import { TrustScoreBadge } from '@/components/common/trust/trust-score-badge';
import { TrustScoreSheet } from '@/components/common/trust/trust-score-sheet';
import { CategoryBadge } from '@/components/common/category/category-badge';
import { RankMedal } from '@/components/common/display/rank-medal';
import { ScoreStars } from '@/components/common/display/score-stars';
import { LoginCtaDialog } from '@/components/common/login-cta-dialog';
import { RestaurantThumbnail } from '@/components/common/restaurant/restaurant-thumbnail';
import type {
  Category,
  RatingScores,
  SceneTag,
  TrustBreakdown,
  VisitStatus,
  RegionalRankEntry,
  RestaurantDetail,
} from '@/lib/types/restaurant';
import { SCORE_LABELS } from '@/lib/domain/score-labels';

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
  onFocusMap?: (id: string) => void; // 카드 클릭 시 지도 클로즈업 + 핀 강조 트리거 (regional 전용)
  onRemoveFromWishlist?: (id: string) => void;
  // variant="my"에서 타인의 랭킹을 볼 때 — 라벨을 "{name}의 평점"으로, 수정 링크 숨김
  ownerName?: string;
}

// 가게 목록 행 — regional(랭킹)/my(내 랭킹)/wishlist(가고 싶은 곳) 3개 variant 지원
export function PlaceListRow({
  data,
  variant,
  hideBookmark = false,
  hideTrustScore = false,
  hideReviewCta = false,
  showVisitStats = false,
  minimal = false,
  active = false,
  onFocusMap,
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
  } = data;

  const router = useRouter();
  const bookmarked = useWishlistMock((s) => s.isBookmarked(id));
  const toggleWishlist = useWishlistMock((s) => s.toggle);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { trigger: triggerBookmark, dialogProps: bookmarkDialogProps, isAuthed } = useAuthGatedAction({
    action: () => toggleWishlist(id),
    callbackPath: `/restaurant/${id}`,
    description: '로그인하면 맛집을 저장할 수 있어요',
  });

  const showTrustScore = variant === 'regional' && !hideTrustScore && !minimal;
  const showBookmarkOverlay = variant === 'regional' && !hideBookmark;

  return (
    <>
      <div
        data-restaurant-id={id}
        className={cn(
          'group relative flex items-center gap-3 pl-3 pr-3 py-4 transition-colors hover:bg-muted/30 sm:gap-4 sm:pl-4 sm:pr-4',
          active && 'bg-primary-subtle/40',
          onFocusMap && 'cursor-pointer',
        )}
        role={onFocusMap ? 'button' : undefined}
        tabIndex={onFocusMap ? 0 : undefined}
        onClick={() => onFocusMap?.(id)}
        onKeyDown={onFocusMap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFocusMap(id); } } : undefined}
      >
        {/* ① 좌측 머리 — wishlist: 큰 북마크 토글 / regional·my: 랭크 메달 (minimal 시 생략) */}
        {variant === 'wishlist' ? (
          <button
            type="button"
            onClick={() => onRemoveFromWishlist?.(id)}
            aria-label="북마크 해제"
            className="shrink-0 self-center w-11 h-11 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
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
          {onFocusMap ? (
            <div className="relative w-full h-full overflow-hidden rounded-xl">
              <RestaurantThumbnail
                src={imageUrl}
                alt={name}
                category={category}
                className="absolute inset-0 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <Link
              href={`/restaurant/${id}`}
              className="relative block w-full h-full overflow-hidden rounded-xl"
            >
              <RestaurantThumbnail
                src={imageUrl}
                alt={name}
                category={category}
                className="absolute inset-0 group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}

          {showBookmarkOverlay && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerBookmark();
              }}
              className={cn(
                'absolute top-1 right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm after:absolute after:content-[""] after:-inset-2',
                bookmarked && isAuthed
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background/85 text-ink/70 hover:bg-background',
              )}
              aria-label="북마크"
            >
              <Bookmark className={cn('w-3.5 h-3.5', bookmarked && isAuthed && 'fill-current')} />
            </button>
          )}

        </div>

        {/* ③ 중앙 컬럼 */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-1 text-caption-1 text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0">
              <CategoryBadge category={category} />
              <span className="truncate">· {[subCategory, region].filter(Boolean).join(' · ')}</span>
            </div>
            {/* 모바일용 평점 인라인 표시 — minimal 시 신규 칩 */}
            {minimal && variant === 'regional' ? (
              <span className="sm:hidden inline-flex items-center px-2 py-0.5 rounded-chip bg-muted text-secondary-foreground text-caption-2 shrink-0">신규</span>
            ) : (variant === 'my' ? myAvgScore : communityAvgScore) != null ? (
              <ScoreStars
                score={(variant === 'my' ? myAvgScore : communityAvgScore)!}
                size="sm"
                className="sm:hidden shrink-0 gap-0.5"
              />
            ) : null}
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); router.push(`/restaurant/${id}`); }}
            className="self-start inline-flex items-center gap-1 max-w-full text-title-1 text-foreground text-left bg-transparent p-0 hover:underline cursor-pointer"
            aria-label={`${name} 상세 보기`}
          >
            <span className="truncate min-w-0">{name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" aria-hidden />
          </button>

          {/* regional: 방문 통계 */}
          {variant === 'regional' && showVisitStats && visitCount != null && lastVisitedAt != null && (
            <span className="text-caption-2 text-muted-foreground -mt-0.5" suppressHydrationWarning>
              {visitCount}번 · {formatDistanceToNow(new Date(lastVisitedAt as Date), { addSuffix: true, locale: ko })}
            </span>
          )}

          {/* comment (regional / my) — minimal 시 미노출 */}
          {(variant === 'regional' || variant === 'my') && (
            minimal && variant === 'regional' ? null : comment ? (
              <button
                type="button"
                onClick={onFocusMap ? undefined : (e) => { e.stopPropagation(); router.push(`/restaurant/${id}`); }}
                className="self-start text-caption-1 text-muted-foreground line-clamp-1 mb-0.5 text-left bg-transparent p-0"
              >
                &ldquo;{comment}&rdquo;
              </button>
            ) : null
          )}

          {/* wishlist: tagline */}
          {variant === 'wishlist' && tagline && (
            <p className="text-caption-1 text-muted-foreground line-clamp-1 italic mb-0.5">
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          {variant === 'my' && (
            <MyFooter
              id={id}
              scores={scores}
              lastVisitedAt={lastVisitedAt}
              visitCount={visitCount}
              myLatestScene={myLatestScene}
              ownerName={ownerName}
            />
          )}
          {variant === 'regional' && !hideReviewCta && (
            <RegionalFooter
              id={id}
              name={name}
              reviewCount={reviewCount}
              minimal={minimal}
              myStatus={myStatus}
              myAvgScore={myAvgScore}
            />
          )}
          {variant === 'wishlist' && (
            <WishlistFooter
              id={id}
              name={name}
              addedAt={addedAt}
              reviewCount={reviewCount}
            />
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
            <span className="mt-2 inline-flex items-center justify-center px-2 py-0.5 rounded-chip bg-muted text-secondary-foreground text-caption-2">리뷰 부족</span>
          ) : showTrustScore && trustScore != null ? (
            <div onClick={(e) => e.stopPropagation()}>
              <TrustScoreBadge
                score={trustScore}
                size="sm"
                onClick={() => setSheetOpen(true)}
              />
            </div>
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
      {showBookmarkOverlay && <LoginCtaDialog {...bookmarkDialogProps} />}
    </>
  );
}

// my variant — 세부 점수 + 방문 정보 + 수정 링크
function MyFooter({
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
            href={`/restaurant/${id}/review/new?mode=edit`}
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

// regional variant — 리뷰수 + 리뷰 작성/수정 CTA
function RegionalFooter({
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
          href={`/restaurant/${id}/review/new`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
        >
          <Star className="w-3 h-3 fill-primary text-primary" aria-hidden />
          내 평점 {myAvgScore?.toFixed(1)} · 수정
        </Link>
      ) : (
        <Link
          href="/review/new"
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

// wishlist variant — 저장 시점 + 리뷰수 + 리뷰 작성 CTA
function WishlistFooter({
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
        href="/review/new"
        className="inline-flex items-center gap-1 text-caption-1 text-primary hover:underline shrink-0"
      >
        <PencilLine className="w-3 h-3" aria-hidden />
        리뷰 쓰기
      </Link>
    </div>
  );
}

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
    imageUrl: detail.photos[0] ?? '',
    communityAvgScore: detail.communityAvgScore,
    trustScore: detail.trustScore,
    trustBreakdown: detail.trustBreakdown,
    reviewCount: detail.reviewCount,
    tagline: detail.tagline,
    addedAt: opts.addedAt,
  };
}
