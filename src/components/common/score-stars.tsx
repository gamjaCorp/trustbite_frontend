// 별점 + 점수 인라인 표시 — 별점 표기 표준 컴포넌트
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  textClassName?: string;
}

const ICON_SIZE = { sm: 'w-3 h-3', md: 'w-3.5 h-3.5', lg: 'w-4 h-4' } as const;
const TEXT_CLS = {
  sm: '', // sm은 부모 컨텍스트 글꼴을 상속 — textClassName으로 재정의
  md: 'text-title-2 text-foreground',
  lg: 'text-headline-2 text-foreground',
} as const;

export function ScoreStars({ score, size = 'md', className, textClassName }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <Star className={cn(ICON_SIZE[size], 'fill-warning text-warning')} aria-hidden />
      <span className={cn(TEXT_CLS[size], 'tabular-nums', textClassName)}>{score.toFixed(1)}</span>
    </span>
  );
}
