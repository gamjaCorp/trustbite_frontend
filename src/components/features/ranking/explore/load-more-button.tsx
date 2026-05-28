'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  visible: boolean;
  count: number; // 더 불러올 개수
  onClick: () => void;
  className?: string;
}

// 지도 오버레이 더보기 버튼 — "이 지역에서 검색"과 상호 배타로 표시
export function LoadMoreButton({ visible, count, onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-background text-primary px-4 py-2 text-title-2 shadow-lg ring-1 ring-border cursor-pointer',
        'transition-all duration-300',
        'hover:-translate-y-0.5 hover:shadow-xl active:scale-95',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
        className,
      )}
    >
      <Plus className="w-4 h-4 text-primary" />
      {count}개 더보기
    </button>
  );
}
