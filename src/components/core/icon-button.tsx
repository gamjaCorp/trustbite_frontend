import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props extends Omit<ComponentProps<typeof Button>, 'children' | 'size'> {
  icon: LucideIcon;
  'aria-label': string; // 아이콘 전용 버튼이므로 라벨 필수
  active?: boolean; // true → variant="default"(bg-primary), false → variant prop 그대로
  size?: 'icon-sm' | 'icon' | 'icon-lg'; // 기본 'icon'(w-9 h-9)
  iconClassName?: string; // 아이콘 추가 클래스 (예: 'fill-current')
}

// 원형 아이콘 버튼 — ui/button을 rounded-full로 감싼 공통 프리미티브
export function IconButton({
  icon: Icon,
  variant = 'secondary',
  size = 'icon',
  active,
  iconClassName,
  className,
  ...rest
}: Props) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : variant}
      size={size}
      className={cn('rounded-full', className)}
      {...rest}
    >
      <Icon className={cn('w-4 h-4', iconClassName)} />
    </Button>
  );
}
