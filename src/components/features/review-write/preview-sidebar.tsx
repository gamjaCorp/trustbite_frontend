import { RankingPreview } from './ranking-preview';
import { TrustDeltaCard } from './trust-delta-card';
import type { RegionalRankEntry } from '@/types/restaurant';

interface Props {
  myTopRestaurants: RegionalRankEntry[];
  baseScore: number;
  remainingReviewsForNextGrade: number;
  nextGradeName: string;
  onSubmit: () => void;
}

export function PreviewSidebar({
  myTopRestaurants,
  baseScore,
  remainingReviewsForNextGrade,
  nextGradeName,
  onSubmit,
}: Props) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-16">
      <RankingPreview myTopRestaurants={myTopRestaurants} />
      <TrustDeltaCard
        baseScore={baseScore}
        remainingReviewsForNextGrade={remainingReviewsForNextGrade}
        nextGradeName={nextGradeName}
        onSubmit={onSubmit}
      />
    </aside>
  );
}
