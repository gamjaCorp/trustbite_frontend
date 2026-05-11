import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value?: string;
  href?: string;
  tone?: 'default' | 'danger';
}

export function ProfileListRow({ label, value, href, tone = 'default' }: Props) {
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
      <span className="inline-flex items-center gap-2">
        {value && <span className="text-caption-2 text-muted-foreground">{value}</span>}
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </span>
    </>
  );

  const className =
    'flex items-center justify-between w-full px-5 py-3.5 hover:bg-muted/30 transition-colors';

  return (
    <li>
      {href ? (
        <Link href={href} className={className}>
          {content}
        </Link>
      ) : (
        <button type="button" className={className}>
          {content}
        </button>
      )}
    </li>
  );
}
