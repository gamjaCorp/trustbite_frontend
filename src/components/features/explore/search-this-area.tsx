'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  visible: boolean;
  onClick: () => void;
  className?: string;
}

export function SearchThisArea({ visible, onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-background text-primary px-4 py-2 text-title-2 shadow-lg ring-1 ring-border',
        'transition-all duration-300',
        'hover:-translate-y-0.5 hover:shadow-xl active:scale-95',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
        className,
      )}
    >
      <Search className="w-4 h-4" />
      이 지역에서 검색
    </button>
  );
}
