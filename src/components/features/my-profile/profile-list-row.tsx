import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Props {
  label: string;
  value?: string;
  href?: string;
  tone?: 'default' | 'danger';
  rightSlot?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

// 프로필 설정·활동 섹션의 단일 행
export function ProfileListRow({ label, value, href, tone = 'default', rightSlot, onClick, disabled }: Props) {
  const content = (
    <>
      <span className={cn('text-title-3', !disabled && tone === 'danger' ? 'text-error' : 'text-foreground')}>
        {label}
      </span>
      {disabled ? (
        <Badge variant="secondary" className="text-caption-2">준비 중</Badge>
      ) : (rightSlot ?? (
        <span className="inline-flex items-center gap-2">
          {value && <span className="text-caption-2 text-muted-foreground">{value}</span>}
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </span>
      ))}
    </>
  );

  const baseClassName = 'flex items-center justify-between w-full px-8 py-4 transition-colors';
  const activeClassName = cn(baseClassName, 'hover:bg-muted/30');
  const disabledClassName = cn(baseClassName, 'opacity-35 cursor-not-allowed');

  return (
    <li>
      {disabled ? (
        <div aria-disabled="true" className={disabledClassName}>
          {content}
        </div>
      ) : href ? (
        <Link href={href} className={activeClassName}>
          {content}
        </Link>
      ) : rightSlot ? (
        <div className={activeClassName}>{content}</div>
      ) : (
        <button type="button" className={activeClassName} onClick={onClick}>
          {content}
        </button>
      )}
    </li>
  );
}
