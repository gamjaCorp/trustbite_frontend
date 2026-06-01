'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import ReviewWriteProvider, {
  type ReviewDraft,
  type ReviewResultSnapshot,
  type SelectedRestaurant,
  type TrustBreakdown,
  LONG_TEXT_THRESHOLD,
  TRUST_DELTA,
  useReviewActions,
  useReviewIsEditMode,
  useReviewIsValid,
  useReviewPhotoCount,
  useReviewPhotos,
  useReviewText,
  useReviewTextLength,
  useReviewTrustDelta,
  useSelectedRestaurant,
} from '@/stores/review-write-store';
import type { RegionalRankEntry } from '@/lib/types/restaurant';
import type { GradeLevel } from '@/lib/domain/grade-levels';
import { ReviewResultDialog } from './review-result/index';

import { TargetRestaurantCard } from './fields/target-restaurant-card';
import { RestaurantPicker } from './fields/restaurant-picker';
import { RatingFields } from './fields/rating-fields';
import { SceneTagSelector } from './fields/scene-tag-selector';
import { ReviewTextField } from './fields/review-text-field';
import { PhotoUploadGrid } from './fields/photo-upload-grid';
import { LocationVerifyBanner } from './fields/location-verify-banner';
import { PreviewSidebar } from './preview/preview-sidebar';

interface Props {
  initialSelectedRestaurant?: SelectedRestaurant | null;
  initialDraft?: ReviewDraft | null;
  candidates: RegionalRankEntry[];
  myTopRestaurants: RegionalRankEntry[];
  baseTrustScore: number;
  remainingReviewsForNextGrade: number;
  nextGradeName: string;
  currentLevel: GradeLevel;
  currentGradeReviewCount: number;
  currentGradeReviewTarget: number;
}

export function ReviewWriteForm({ initialSelectedRestaurant, initialDraft, ...rest }: Props) {
  return (
    <ReviewWriteProvider
      initialSelectedRestaurant={initialSelectedRestaurant ?? null}
      initialDraft={initialDraft ?? null}
    >
      <ReviewWriteFormInner {...rest} />
    </ReviewWriteProvider>
  );
}

type InnerProps = Omit<Props, 'initialSelectedRestaurant'>;

function ReviewWriteFormInner({
  candidates,
  myTopRestaurants,
  baseTrustScore,
  remainingReviewsForNextGrade,
  nextGradeName,
  currentLevel,
  currentGradeReviewCount,
  currentGradeReviewTarget,
}: InnerProps) {
  const router = useRouter();
  const selected = useSelectedRestaurant();
  const { reset } = useReviewActions();
  const photos = useReviewPhotos();
  const text = useReviewText();
  const isEditMode = useReviewIsEditMode();
  const isPicking = selected === null;

  const [resultSnapshot, setResultSnapshot] = useState<ReviewResultSnapshot | null>(null);
  const [resultOpen, setResultOpen] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;

    const hasPhoto = photos.length > 0;
    const hasLongText = text.length >= LONG_TEXT_THRESHOLD;
    const breakdown: TrustBreakdown = {
      consistency: TRUST_DELTA.consistency,
      photo: hasPhoto ? TRUST_DELTA.photo : null,
      longText: hasLongText ? TRUST_DELTA.longText : null,
      total:
        TRUST_DELTA.consistency +
        (hasPhoto ? TRUST_DELTA.photo : 0) +
        (hasLongText ? TRUST_DELTA.longText : 0),
    };
    const nextTrustScore = Math.min(100, baseTrustScore + breakdown.total);

    const snapshot: ReviewResultSnapshot = {
      restaurantId: selected.id,
      baseTrustScore,
      nextTrustScore,
      breakdown,
      photoCount: photos.length,
      currentLevel,
      currentGradeReviewCount: currentGradeReviewCount + 1,
      currentGradeReviewTarget,
      nextGradeName,
      remainingReviewsForNextGrade: Math.max(0, remainingReviewsForNextGrade - 1),
      // TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11)
      // pointsEarned: 5 + (hasPhoto ? 3 : 0) + (text.length >= 100 ? 2 : 0),
      // pointReasons: [
      //   { label: '리뷰', value: 5 },
      //   ...(hasPhoto ? [{ label: '사진', value: 3 }] : []),
      //   ...(text.length >= 100 ? [{ label: '100자', value: 2 }] : []),
      // ],
    };

    setResultSnapshot(snapshot);
    setResultOpen(true);
  };

  const handleWriteMore = () => {
    setResultOpen(false);
    setResultSnapshot(null);
    reset();
  };

  const handleViewMyReview = () => {
    const restaurantId = resultSnapshot?.restaurantId;
    setResultOpen(false);
    setResultSnapshot(null);
    reset();
    if (restaurantId) {
      router.push(`/restaurant/${restaurantId}`);
    }
  };

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-6 pb-28 lg:pb-16">
        <h1 className="text-headline-1 mb-4">{isEditMode ? '리뷰 수정' : '리뷰 쓰기'}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <section className="space-y-5">
            <FieldGroup
              label="가게"
              hint={isPicking ? '다녀온 음식점을 선택해주세요' : undefined}
              required
            >
              {isPicking ? <RestaurantPicker candidates={candidates} /> : <TargetRestaurantCard />}
            </FieldGroup>

            <DimmedWhilePicking dimmed={isPicking}>
              <FieldGroup label="평가" hint="항목별로 선택" required>
                <RatingFields />
              </FieldGroup>

              <FieldGroup label="상황" hint="다중 선택">
                <SceneTagSelector />
              </FieldGroup>

              <FieldGroup label="리뷰" hint={<ReviewHint />} labelRight={<ReviewCharCount />}>
                <ReviewTextField />
              </FieldGroup>

              <FieldGroup label="사진" hint={<PhotoHint />}>
                <PhotoUploadGrid hideHeader />
              </FieldGroup>

              <LocationVerifyBanner />
            </DimmedWhilePicking>
          </section>

          <DimmedWhilePicking dimmed={isPicking}>
            <PreviewSidebar
              myTopRestaurants={myTopRestaurants}
              baseScore={baseTrustScore}
              remainingReviewsForNextGrade={remainingReviewsForNextGrade}
              nextGradeName={nextGradeName}
              onSubmit={handleSubmit}
            />
          </DimmedWhilePicking>
        </div>
      </main>

      {!isPicking && <MobileSubmitBar onSubmit={handleSubmit} baseTrustScore={baseTrustScore} />}

      {resultSnapshot && (
        <ReviewResultDialog
          open={resultOpen}
          snapshot={resultSnapshot}
          onWriteMore={handleWriteMore}
          onViewMyReview={handleViewMyReview}
        />
      )}
    </>
  );
}

function DimmedWhilePicking({
  dimmed,
  children,
}: {
  dimmed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={dimmed || undefined}
      inert={dimmed || undefined}
      className={cn(
        'space-y-5 transition-opacity duration-200',
        dimmed && 'opacity-40 select-none',
      )}
    >
      {children}
    </div>
  );
}

function FieldGroup({
  label,
  hint,
  required,
  labelRight,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  labelRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-title-2 text-foreground">
          {label}
          {required && <span className="ml-0.5 text-destructive" aria-hidden>*</span>}
        </span>
        {hint && <span className="text-caption-2 text-muted-foreground flex items-center gap-1">· {hint}</span>}
        {labelRight && <span className="ml-auto text-caption-2 text-muted-foreground">{labelRight}</span>}
      </div>
      {children}
    </div>
  );
}

// 리뷰 100자 돌파 힌트 — 라벨 바로 옆
function ReviewHint() {
  const length = useReviewTextLength();
  const reached = length >= LONG_TEXT_THRESHOLD;
  if (!reached) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-primary font-semibold">
      <Check className="w-3 h-3" />
      {LONG_TEXT_THRESHOLD}자 돌파 +{TRUST_DELTA.longText}%
    </span>
  );
}

// 리뷰 글자수 — 우측 표시
function ReviewCharCount() {
  const length = useReviewTextLength();
  return <span>{length}자</span>;
}

// 사진 첨부 힌트 — 라벨 바로 옆
function PhotoHint() {
  const count = useReviewPhotoCount();
  const reached = count > 0;
  return (
    <span className={cn('flex items-center gap-0.5 transition-colors', reached ? 'text-primary font-semibold' : '')}>
      {reached && <Check className="w-3 h-3" />}
      사진 첨부 +{TRUST_DELTA.photo}%
    </span>
  );
}

// 모바일 전용 하단 고정 제출 바 — lg 이상에서는 사이드바 CTA 사용
function MobileSubmitBar({
  onSubmit,
  baseTrustScore,
}: {
  onSubmit: () => void;
  baseTrustScore: number;
}) {
  const isValid = useReviewIsValid();
  const delta = useReviewTrustDelta();
  const next = Math.min(100, baseTrustScore + delta);
  const isEditMode = useReviewIsEditMode();

  // 신뢰도 프리뷰(좌)와 CTA(우)를 한 행에 배치해 수직 공간을 절약
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <div className="flex flex-col">
          <span className="text-caption-2 text-muted-foreground">신뢰도</span>
          <span className="text-title-2 text-foreground">
            {baseTrustScore}% → <span className="text-primary">{next.toFixed(0)}%</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValid}
          className={cn(
            'ml-auto h-12 rounded-xl px-6 text-label-1 transition-colors',
            isValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]'
              : 'bg-muted text-muted-foreground cursor-not-allowed',
          )}
        >
          {isEditMode ? '리뷰 수정하기' : '리뷰 등록하기'}
        </button>
      </div>
    </div>
  );
}
