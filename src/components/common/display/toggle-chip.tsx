import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  active: boolean;
  onClick: () => void;
  variant?: 'filter' | 'form'; // filter=상황 필터용(primary-subtle), form=리뷰 작성용(primary/10+ring)
  size?: 'sm' | 'md'; // sm=label-3 px-3, md=label-2 px-3.5
  className?: string;
  children: ReactNode;
}

// 활성/비활성 토글 칩 버튼 — 상황 필터·태그 선택에 공통으로 사용
export function ToggleChip({ active, onClick, variant = 'filter', size = 'sm', className, children }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 shrink-0 rounded-chip transition-colors',
        size === 'sm' ? 'px-3 py-1.5 text-label-3' : 'px-3.5 py-1.5 text-label-2',
        variant === 'filter'
          ? active
            ? 'bg-primary-subtle text-primary'
            : 'bg-muted text-muted-foreground hover:text-foreground'
          : active
            ? 'bg-primary/10 text-primary ring-1 ring-primary/40'
            : 'bg-muted text-foreground hover:bg-muted/70',
        className,
      )}
    >
      {children}
    </button>
  );
}
