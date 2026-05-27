// 방문 순서 칩 — 2번째 이상 방문일 때만 렌더
import { cn } from '@/lib/utils';

interface Props {
  ordinal: number;
  className?: string;
}

export function VisitOrdinalChip({ ordinal, className }: Props) {
  if (ordinal <= 1) return null;
  return (
    <span className={cn('rounded-chip bg-info/10 text-info px-1.5 py-0.5 text-label-3', className)}>
      {ordinal}번째 방문
    </span>
  );
}
