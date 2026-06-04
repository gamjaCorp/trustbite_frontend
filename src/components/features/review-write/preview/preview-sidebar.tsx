import { RankingPreview } from './ranking-preview';
import { TrustDeltaCard } from './trust-delta-card';
import type { RegionalRankEntry } from '@/lib/types/restaurant';

interface Props {
  myTopRestaurants: RegionalRankEntry[];
  baseScore: number;
  remainingReviewsForNextGrade: number;
  nextGradeName: string;
  onSubmit: () => void;
}

// 리뷰 작성 데스크톱 사이드바 — 현재 입력 내용을 실시간으로 미리보기
export function PreviewSidebar({
  myTopRestaurants,
  baseScore,
  remainingReviewsForNextGrade,
  nextGradeName,
  onSubmit,
}: Props) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-[var(--header-height)]">
      <TrustDeltaCard
        baseScore={baseScore}
        remainingReviewsForNextGrade={remainingReviewsForNextGrade}
        nextGradeName={nextGradeName}
        onSubmit={onSubmit}
      />
      <RankingPreview myTopRestaurants={myTopRestaurants} />
    </aside>
  );
}
