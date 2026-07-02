'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import ReviewWriteProvider, {
  type ReviewDraft,
  type ReviewResultSnapshot,
  type SelectedRestaurant,
  useReviewActions,
  useReviewIsEditMode,
  useReviewPhotos,
  useReviewText,
  useSelectedRestaurant,
} from './stores/review-write-store';
import { buildReviewSnapshot } from './build-review-snapshot';
import type { RegionalRankEntry } from '@/lib/types/restaurant';
import type { GradeContext } from './type/grade-context';
import { ReviewResultDialog } from './review-result/index';

import { FieldGroup } from './fields/field-group';
import { TargetRestaurantCard } from './fields/target-restaurant-card';
import { RestaurantPicker } from './fields/restaurant-picker';
import { RatingFields } from './fields/rating-fields';
import { SceneTagSelector } from './fields/scene-tag-selector';
import { ReviewTextField } from './fields/review-text-field';
import { PhotoUploadGrid } from './fields/photo-upload-grid';
import { LocationVerifyBanner } from './fields/location-verify-banner';
import { PreviewSidebar } from './preview/preview-sidebar';
import { ReviewHint, ReviewCharCount, PhotoHint } from './fields/field-hints';
import { MobileSubmitBar } from './fields/mobile-submit-bar';

interface Props {
  initialSelectedRestaurant?: SelectedRestaurant | null;
  initialDraft?: ReviewDraft | null;
  candidates: RegionalRankEntry[];
  myTopRestaurants: RegionalRankEntry[];
  gradeContext: GradeContext;
}

// 리뷰 작성 폼 진입점
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

type InnerProps = Omit<Props, 'initialSelectedRestaurant' | 'initialDraft'>;

function ReviewWriteFormInner({ candidates, myTopRestaurants, gradeContext }: InnerProps) {
  const { baseTrustScore, nextGradeName, remainingReviewsForNextGrade } = gradeContext;

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
    const snapshot = buildReviewSnapshot({
      selected,
      photoCount: photos.length,
      text,
      gradeContext,
    });
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

function DimmedWhilePicking({ dimmed, children }: { dimmed: boolean; children: React.ReactNode }) {
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
