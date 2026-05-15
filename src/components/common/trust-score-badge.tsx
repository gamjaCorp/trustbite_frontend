'use client';

import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTrustToneClass } from '@/lib/trust-score';

interface Props {
  score: number;
  size?: 'sm' | 'md';
  onClick?: () => void;
  showIcon?: boolean;
  className?: string;
}

export function TrustScoreBadge({ score, size = 'sm', onClick, showIcon = true, className }: Props) {
  const tone = getTrustToneClass(score);
  const interactive = typeof onClick === 'function';

  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-chip font-semibold',
        tone.text,
        tone.bg,
        size === 'sm' ? 'text-label-3 px-2 py-0.5' : 'text-sm px-2.5 py-1',
        interactive && 'hover:brightness-95 active:scale-95 transition-all cursor-pointer',
        className,
      )}
    >
      {showIcon && <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      {Math.round(score)}%
    </span>
  );

  if (!interactive) return content;

  return (
    <button type="button" onClick={onClick} className="inline-flex">
      {content}
    </button>
  );
}
