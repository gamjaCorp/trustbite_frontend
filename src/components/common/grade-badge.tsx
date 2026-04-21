import { cn } from '@/lib/utils';
import { GRADE_LABEL, getGradeToneClass } from '@/lib/trust-score';
import type { Grade } from '@/types/restaurant';

interface Props {
  grade: Grade;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function GradeBadge({ grade, size = 'sm', showLabel = true, className }: Props) {
  const tone = getGradeToneClass(grade);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-chip font-semibold',
        tone.text,
        tone.bg,
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-0.5',
        className,
      )}
    >
      <span className="font-bold">{grade}</span>
      {showLabel && <span>{GRADE_LABEL[grade]}</span>}
    </span>
  );
}
