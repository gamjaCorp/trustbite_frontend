import { getLevelDef } from '@/lib/domain/grade-levels';
import type { GradeLevel } from '@/lib/domain/grade-levels';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';
type State = 'default' | 'muted' | 'next';

interface Props {
  level: GradeLevel;
  size?: Size;
  variant?: 'inline' | 'circle';
  state?: State;
  className?: string;
}

const SIZE_MAP = {
  sm: { circle: 'w-9 h-9',   icon: 'w-4 h-4' },
  md: { circle: 'w-12 h-12', icon: 'w-5 h-5' },
  lg: { circle: 'w-20 h-20', icon: 'w-9 h-9' },
} satisfies Record<Size, { circle: string; icon: string }>;

export function GradeIcon({
  level,
  size = 'md',
  variant = 'circle',
  state = 'default',
  className,
}: Props) {
  const def = getLevelDef(level);
  const Icon = def.icon;
  const isMuted = state === 'muted';
  const isNext = state === 'next';

  if (variant === 'inline') {
    return (
      <Icon
        className={cn(
          SIZE_MAP[size].icon,
          isMuted ? 'text-muted-foreground/50' : def.toneClass.text,
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full ring-2 transition-all',
        SIZE_MAP[size].circle,
        isMuted ? 'bg-muted ring-transparent' : cn(def.toneClass.bg, def.toneClass.ring),
        isNext && 'ring-primary',
        className,
      )}
    >
      <Icon
        className={cn(
          SIZE_MAP[size].icon,
          isMuted ? 'text-muted-foreground/50' : def.toneClass.text,
        )}
      />
    </span>
  );
}
