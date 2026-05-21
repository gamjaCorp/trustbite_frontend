// 수직 라벨+값 셀로 구성된 통계 스트립 — 페이지 간 공용
import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface StatsStripItem {
  label: ReactNode;
  value: ReactNode;
  href?: string;
  valueClassName?: string;
}

interface Props {
  items: StatsStripItem[];
}

export function StatsStrip({ items }: Props) {
  return (
    <div className="bg-card rounded-2xl shadow-card flex divide-x divide-border overflow-hidden">
      {items.map((item, i) => {
        const inner = (
          <>
            <p className="text-body-3 text-muted-foreground">{item.label}</p>
            <p className={cn('text-headline-1 text-foreground', item.valueClassName)}>
              {item.value}
            </p>
          </>
        );

        if (item.href) {
          return (
            <Link
              key={i}
              href={item.href}
              className="flex-1 p-6 space-y-1.5 hover:bg-muted/30 transition-colors"
            >
              {inner}
            </Link>
          );
        }

        return (
          <div key={i} className="flex-1 p-6 space-y-1.5">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
