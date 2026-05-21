// 맛집/리뷰 공통 카드 셸 — rounded-card + bg-card + ring-1 ring-border + shadow-card 패턴 고정
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function PlaceCard({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-card bg-card ring-1 ring-border shadow-card', className)}
      {...props}
    />
  );
}
