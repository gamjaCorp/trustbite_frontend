// 순위 메달 배지 — 1~3위는 메달 색(금/은/동), 그 외는 fallback 톤
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { getRankMedalClasses } from '@/lib/domain/rank';

interface Props extends ComponentPropsWithoutRef<'span'> {
  rank: number;
  fallbackTone?: 'muted' | 'paper';
}

// 순위 메달 칩 — 1~3위 금·은·동, 그 외는 숫자 칩으로 표시
export function RankMedal({ rank, fallbackTone = 'muted', className, ...rest }: Props) {
  const fallback =
    fallbackTone === 'paper' ? 'bg-paper-edge text-ink/70' : 'bg-muted text-muted-foreground';
  return (
    <span
      className={cn(
        'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-title-3',
        getRankMedalClasses(rank) ?? fallback,
        className,
      )}
      {...rest}
    >
      {rank}
    </span>
  );
}
