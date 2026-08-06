'use client';

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  visible: boolean;
  icon: LucideIcon;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
}

// 지도 위에 띄우는 플로팅 액션 버튼 — visible 상태에 따라 fade+slide 전환
export function FloatingMapActionButton({ visible, icon: Icon, label, onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-background text-primary px-4 py-2 text-title-2 shadow-lg ring-1 ring-border',
        'transition-all duration-300',
        'hover:-translate-y-0.5 hover:shadow-xl press-scale',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
        className,
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
