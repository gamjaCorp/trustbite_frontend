import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value?: string;
  href?: string;
  tone?: 'default' | 'danger';
  rightSlot?: React.ReactNode;
  onClick?: () => void;
}

export function ProfileListRow({ label, value, href, tone = 'default', rightSlot, onClick }: Props) {
  const content = (
    <>
      <span
        className={cn(
          'text-title-3',
          tone === 'danger' ? 'text-error' : 'text-foreground',
        )}
      >
        {label}
      </span>
      {rightSlot ?? (
        <span className="inline-flex items-center gap-2">
          {value && <span className="text-caption-2 text-muted-foreground">{value}</span>}
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </span>
      )}
    </>
  );

  const className =
    'flex items-center justify-between w-full px-8 py-4 hover:bg-muted/30 transition-colors';

  return (
    <li>
      {href ? (
        <Link href={href} className={className}>
          {content}
        </Link>
      ) : (
        <button type="button" className={className} onClick={onClick}>
          {content}
        </button>
      )}
    </li>
  );
}
