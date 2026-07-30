import { GRADE_LEVELS } from '@/lib/domain/grade-levels';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';
type State = 'default' | 'muted' | 'next';

interface Props {
  name: string; // 등급 이름 (예: 'COLLECTOR') — 서버 grade.name과 매칭
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

// 등급 원형 아이콘 — 레벨별 색상·아이콘을 원에 담아 표시
export function GradeIcon({
  name,
  size = 'md',
  variant = 'circle',
  state = 'default',
  className,
}: Props) {
  const def = GRADE_LEVELS.find((g) => g.name === name) ?? GRADE_LEVELS[0];
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
