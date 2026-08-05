import { RankingPreview } from './ranking-preview';
import { TrustDeltaCard } from './trust-delta-card';
import type { RegionalRankEntry } from '@/types/restaurant';

interface Props {
  myTopRestaurants: RegionalRankEntry[];
  baseScore: number;
  remainingReviewsForNextGrade: number;
  nextGrade: string; // 다음 등급 enum 이름 — TrustDeltaCard가 라벨·아이콘으로 변환
  onSubmit: () => void;
}

// 리뷰 작성 데스크톱 사이드바 — 현재 입력 내용을 실시간으로 미리보기
export function PreviewSidebar({
  myTopRestaurants,
  baseScore,
  remainingReviewsForNextGrade,
  nextGrade,
  onSubmit,
}: Props) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-[var(--header-height)]">
      <TrustDeltaCard
        baseScore={baseScore}
        remainingReviewsForNextGrade={remainingReviewsForNextGrade}
        nextGrade={nextGrade}
        onSubmit={onSubmit}
      />
      <RankingPreview myTopRestaurants={myTopRestaurants} />
    </aside>
  );
}
