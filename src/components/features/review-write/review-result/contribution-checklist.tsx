import { CheckCircle2 } from 'lucide-react';

import { Surface } from '@/components/common/display/surface';
import type { TrustBreakdown } from '@/stores/review-write-store';

interface Props {
  breakdown: TrustBreakdown;
  photoCount: number;
}

// 리뷰 제출 기여 체크리스트 — 신뢰도 상승 항목별 기여 포인트 표시
export function ContributionChecklist({ breakdown, photoCount }: Props) {
  const items: Array<{ label: string; value: number }> = [
    { label: '최근 활동 꾸준함', value: breakdown.consistency },
    ...(breakdown.photo !== null
      ? [{ label: `사진 ${photoCount}장 첨부`, value: breakdown.photo }]
      : []),
    ...(breakdown.longText !== null
      ? [{ label: '100자 이상 작성', value: breakdown.longText }]
      : []),
  ];

  return (
    <Surface variant="card" padding="md">
      <p className="text-label-2 text-muted-foreground mb-3">이런 점이 좋았어요</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span className="text-body-2 text-foreground">{item.label}</span>
            </div>
            <span className="text-label-2 text-success shrink-0">
              +{item.value.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
