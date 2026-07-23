import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Props {
  icon: LucideIcon;
  iconClassName?: string; // 아이콘 색상 (예: "text-palette-amber")
  label: ReactNode;
  met?: boolean; // true → Check 아이콘, false → remaining 표시, undefined → 우측 없음
  remaining?: ReactNode; // met이 false일 때 표시되는 잔여량 텍스트
  progressValue: number;
  progressClassName?: string; // Progress 바 색상 오버라이드
}

// 아이콘·라벨·달성여부·Progress 바 1세트 — 등급 조건 진행률 등에 사용
export function MetricProgressBlock({
  icon: Icon,
  iconClassName,
  label,
  met,
  remaining,
  progressValue,
  progressClassName,
}: Props) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={cn('w-3.5 h-3.5 shrink-0', iconClassName)} />
          <span className="text-label-2 text-foreground">{label}</span>
        </div>
        {met === true && (
          <Check className="w-4 h-4 text-success" strokeWidth={2.5} />
        )}
        {met === false && remaining != null && (
          <span className="text-label-3 text-muted-foreground">{remaining}</span>
        )}
      </div>
      <Progress value={progressValue} className={cn('h-3', progressClassName)} />
    </div>
  );
}
