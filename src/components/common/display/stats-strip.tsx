// 수직 라벨+값 셀로 구성된 통계 스트립 — 페이지 간 공용
import type { ReactNode } from 'react';

import { Surface } from './surface';
import { StatCell } from './stat-cell';

interface StatsStripItem {
  label: ReactNode;
  value: ReactNode;
  href?: string;
  valueClassName?: string;
}

interface Props {
  items: StatsStripItem[];
}

// 통계 스트립 — 수평으로 나열된 수치(리뷰 수·점수 등) 요약 카드
export function StatsStrip({ items }: Props) {
  return (
    <Surface variant="elevated" padding="none" className="flex divide-x divide-border overflow-hidden">
      {items.map((item, i) => (
        <StatCell
          key={i}
          label={item.label}
          value={item.value}
          href={item.href}
          valueClassName={item.valueClassName}
          className="flex-1 p-6"
        />
      ))}
    </Surface>
  );
}
