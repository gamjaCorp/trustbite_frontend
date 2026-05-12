'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import ReviewWriteProvider, {
  type ReviewResultSnapshot,
  type SelectedRestaurant,
  type TrustBreakdown,
  LONG_TEXT_THRESHOLD,
  TRUST_DELTA,
  useReviewActions,
  useReviewPhotos,
  useReviewText,
  useSelectedRestaurant,
} from '@/stores/review-write-store';
import type { Grade, RegionalRankEntry } from '@/types/restaurant';
import { ReviewResultDialog } from '@/components/features/review-result/review-result-dialog';

import { TargetRestaurantCard } from './target-restaurant-card';
import { RestaurantPicker } from './restaurant-picker';
import { RatingFields } from './rating-fields';
import { SceneTagSelector } from './scene-tag-selector';
import { ReviewTextField } from './review-text-field';
import { PhotoUploadGrid } from './photo-upload-grid';
import { LocationVerifyBanner } from './location-verify-banner';
import { PreviewSidebar } from './preview-sidebar';

interface Props {
  initialSelectedRestaurant?: SelectedRestaurant | null;
  candidates: RegionalRankEntry[];
  myTopRestaurants: RegionalRankEntry[];
  baseTrustScore: number;
  remainingReviewsForNextGrade: number;
  nextGradeName: string;
  currentGrade: Grade;
  currentGradeReviewCount: number;
  currentGradeReviewTarget: number;
}

export function ReviewWriteForm({ initialSelectedRestaurant, ...rest }: Props) {
  return (
    <ReviewWriteProvider initialSelectedRestaurant={initialSelectedRestaurant ?? null}>
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
  currentGrade,
  currentGradeReviewCount,
  currentGradeReviewTarget,
}: InnerProps) {
  const router = useRouter();
  const selected = useSelectedRestaurant();
  const { reset } = useReviewActions();
  const photos = useReviewPhotos();
  const text = useReviewText();
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
      currentGrade,
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

  const handleViewRanking = () => {
    setResultOpen(false);
    setResultSnapshot(null);
    reset();
    router.push('/profile');
  };

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-6 pb-16">
        <h1 className="text-headline-2 mb-4">리뷰 쓰기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <section className="space-y-5">
            <FieldGroup
              label="가게"
              hint={isPicking ? '다녀온 음식점을 선택해주세요' : undefined}
            >
              {isPicking ? <RestaurantPicker candidates={candidates} /> : <TargetRestaurantCard />}
            </FieldGroup>

            <DimmedWhilePicking dimmed={isPicking}>
              <FieldGroup label="평가" hint="항목별로 선택">
                <RatingFields />
              </FieldGroup>

              <FieldGroup label="상황" hint="다중 선택">
                <SceneTagSelector />
              </FieldGroup>

              <FieldGroup label="리뷰">
                <ReviewTextField />
              </FieldGroup>

              <PhotoUploadGrid />

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

      {resultSnapshot && (
        <ReviewResultDialog
          open={resultOpen}
          snapshot={resultSnapshot}
          onWriteMore={handleWriteMore}
          onViewRanking={handleViewRanking}
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
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-title-2 text-foreground">{label}</span>
        {hint && <span className="text-caption-2 text-muted-foreground">· {hint}</span>}
      </div>
      {children}
    </div>
  );
}
