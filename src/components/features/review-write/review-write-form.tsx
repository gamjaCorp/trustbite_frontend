'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import ReviewWriteProvider, {
  type SelectedRestaurant,
  useReviewActions,
  useSelectedRestaurant,
} from '@/stores/review-write-store';
import type { RegionalRankEntry } from '@/types/restaurant';

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
}: InnerProps) {
  const router = useRouter();
  const selected = useSelectedRestaurant();
  const { reset } = useReviewActions();
  const isPicking = selected === null;

  const handleSubmit = () => {
    if (!selected) return;
    const targetId = selected.id;
    toast.success('리뷰가 등록되었어요', {
      description: '내 신뢰도가 반영됐어요. 잠시 후 가게 페이지로 이동합니다.',
    });
    reset();
    setTimeout(() => router.replace(`/restaurant/${targetId}`), 600);
  };

  return (
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
        {hint && <span className="text-xs text-muted-foreground">· {hint}</span>}
      </div>
      {children}
    </div>
  );
}
