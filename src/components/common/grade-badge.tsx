import { getLevelDef } from '@/lib/grade-levels';
import type { GradeLevel } from '@/lib/grade-levels';
import { cn } from '@/lib/utils';

import { GradeIcon } from './grade-icon';

interface Props {
  level: GradeLevel;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function GradeBadge({ level, size = 'sm', showLabel = true, className }: Props) {
  const def = getLevelDef(level);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-chip font-semibold',
        def.toneClass.text,
        def.toneClass.bg,
        size === 'sm' ? 'text-label-3 px-1.5 py-0.5' : 'text-sm px-2 py-0.5',
        className,
      )}
    >
      <GradeIcon level={level} size="xs" variant="inline" />
      {showLabel && <span>{def.label}</span>}
    </span>
  );
}
