'use client';

import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTrustToneClass } from '@/lib/domain/trust-score';
import { Badge } from '@/components/ui/badge';

interface Props {
  score: number; // 0~100 신뢰도 점수
  size?: 'sm' | 'md';
  onClick?: () => void; // 전달 시 클릭 가능한 버튼으로 렌더
  showIcon?: boolean;
  className?: string;
}

// 신뢰도 점수를 % 배지로 표시 — ui/Badge 래퍼
export function TrustScoreBadge({ score, size = 'sm', onClick, showIcon = true, className }: Props) {
  const tone = getTrustToneClass(score);
  const interactive = typeof onClick === 'function';

  const sizeClass = size === 'sm' ? 'text-label-3 px-2 py-0.5' : 'text-label-2 px-2.5 py-1';
  const badgeClass = cn('font-semibold', tone.text, tone.bg, sizeClass, className);

  const inner = (
    <>
      {showIcon && <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      {Math.round(score)}%
    </>
  );

  if (!interactive) {
    return <Badge className={badgeClass}>{inner}</Badge>;
  }

  return (
    <Badge asChild>
      <button
        type="button"
        onClick={onClick}
        className={cn(badgeClass, 'hover:brightness-95 transition-all press-scale')}
      >
        {inner}
      </button>
    </Badge>
  );
}
