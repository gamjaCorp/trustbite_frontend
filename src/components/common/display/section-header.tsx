// 섹션 헤더 — 제목 + 선택적 부제목 + 우측 액션 슬롯
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  subtitle?: ReactNode;
  rightAction?: ReactNode;
  // h1=text-headline-1, h2=text-headline-2, h3=text-headline-3
  size?: 'h1' | 'h2' | 'h3';
  className?: string;
}

const SIZE_CLS: Record<NonNullable<Props['size']>, string> = {
  h1: 'text-headline-1',
  h2: 'text-headline-2',
  h3: 'text-headline-3',
};

// 섹션 헤더 — 제목·부제목·오른쪽 액션 슬롯이 있는 섹션 상단 헤더
export function SectionHeader({ title, subtitle, rightAction, size = 'h2', className }: Props) {
  const Tag = size as 'h1' | 'h2' | 'h3';
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="min-w-0 space-y-1">
        <Tag className={cn(SIZE_CLS[size], 'text-foreground truncate')}>{title}</Tag>
        {subtitle && (
          <p className="text-caption-2 text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {rightAction && (
        <div className="shrink-0 flex items-center gap-1.5">{rightAction}</div>
      )}
    </div>
  );
}
