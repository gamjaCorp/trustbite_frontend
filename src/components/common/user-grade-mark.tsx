'use client';

// 사용자 이름 옆에 붙이는 등급 아이콘 — showLabel=false면 hover 툴팁, true면 인라인 텍스트
import { getLevelDef } from '@/lib/grade-levels';
import type { GradeLevel } from '@/lib/grade-levels';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { GradeIcon } from './grade-icon';

interface Props {
  level: GradeLevel;
  showLabel?: boolean;
  size?: 'xs' | 'sm';
  className?: string;
}

export function UserGradeMark({ level, showLabel = false, size = 'sm', className }: Props) {
  const def = getLevelDef(level);
  const tooltip = `Lv.${level} · ${def.label}`;

  if (showLabel) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex items-center gap-1 cursor-default', className)}>
            <GradeIcon level={level} size={size} variant="inline" />
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
          <GradeIcon level={level} size={size} variant="inline" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
