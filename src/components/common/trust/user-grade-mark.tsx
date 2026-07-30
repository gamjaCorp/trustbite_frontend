'use client';

// 사용자 이름 옆에 붙이는 등급 아이콘 — showLabel=false면 hover 툴팁, true면 인라인 텍스트
import { GRADE_LEVELS } from '@/lib/domain/grade-levels';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { GradeIcon } from './grade-icon';

interface Props {
  name: string;
  rank?: number;
  showLabel?: boolean;
  size?: 'sm';
  className?: string;
}

// 유저 등급 마크 — 등급에 따른 색상 배지 + 선택적 라벨
export function UserGradeMark({ name, rank, showLabel = false, size = 'sm', className }: Props) {
  const def = GRADE_LEVELS.find((g) => g.name === name) ?? GRADE_LEVELS[0];
  const tooltip = rank ? `Lv.${rank} · ${def.label}` : def.label;
  if (showLabel) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex items-center gap-1 cursor-default', className)}>
            <GradeIcon name={name} size={size} variant="inline" />
            <span className={cn('text-caption-2', def.toneClass.text)}>{def.label}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn('inline-flex items-center cursor-default', className)}>
          <GradeIcon name={name} size={size} variant="inline" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
