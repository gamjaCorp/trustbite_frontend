import { Coins } from 'lucide-react';

interface Props {
  pointsEarned: number;
  pointReasons: Array<{ label: string; value: number }>;
}

// 포인트 획득 카드 — 리뷰 제출로 얻은 포인트와 이유 목록 표시
export function PointsEarnedCard({ pointsEarned, pointReasons }: Props) {
  const reasonText = pointReasons.map((r) => `${r.label} ${r.value}`).join(' + ');

  return (
    <div className="border-t border-border pt-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4 text-palette-blue shrink-0" />
        <span className="text-label-2 text-foreground font-semibold">포인트 적립</span>
        <span className="text-caption-1 text-muted-foreground">{reasonText}</span>
      </div>
      <span className="text-headline-3 text-palette-blue shrink-0">
        +{pointsEarned}P
      </span>
    </div>
  );
}
