import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props extends Omit<ComponentProps<typeof Button>, 'children' | 'size'> {
  icon: LucideIcon;
  'aria-label': string; // 아이콘 전용 버튼이므로 라벨 필수
  active?: boolean; // true → variant="default"(bg-primary), false → variant prop 그대로
  size?: 'md' | 'lg'; // md(44) | lg(48) — 둘 다 터치 타깃 권장값 44px 이상
  iconClassName?: string; // 아이콘 추가 클래스 (예: 'fill-current')
}

const SIZE_CLASS = {
  md: 'size-11',
  lg: 'size-12',
} as const;

const ICON_CLASS = {
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

// 원형 아이콘 버튼 — ui/button을 rounded-full로 감싼 공통 프리미티브
export function IconButton({
  icon: Icon,
  variant = 'secondary',
  size = 'md',
  active,
  iconClassName,
  className,
  ...rest
}: Props) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : variant}
      size="icon"
      className={cn('rounded-full', SIZE_CLASS[size], className)}
      {...rest}
    >
      <Icon className={cn(ICON_CLASS[size], iconClassName)} />
    </Button>
  );
}
