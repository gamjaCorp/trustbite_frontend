import type { ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface Props {
  label: ReactNode;
  value: ReactNode;
  href?: string;
  size?: 'sm' | 'md'; // sm=title-1(16px), md=headline-1(24px, StatsStrip 기본)
  valueClassName?: string;
  className?: string;
}

// 라벨·값 쌍의 단위 통계 셀 — StatsStrip 내부 및 단독 사용
export function StatCell({ label, value, href, size = 'md', valueClassName, className }: Props) {
  const inner = (
    <>
      <p className={cn('text-muted-foreground', size === 'sm' ? 'text-caption-1' : 'text-body-3')}>
        {label}
      </p>
      <p className={cn(size === 'sm' ? 'text-title-1' : 'text-headline-1', 'text-foreground', valueClassName)}>
        {value}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn('space-y-1.5 hover:bg-muted/30 transition-colors', className)}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {inner}
    </div>
  );
}
