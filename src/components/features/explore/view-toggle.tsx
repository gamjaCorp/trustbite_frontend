'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { label: '리스트', href: '/', icon: List },
  { label: '지도', href: '/map', icon: Map },
] as const;

export function ViewToggle() {
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-background p-0.5 shrink-0">
      {TABS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 h-8 text-sm font-medium transition-colors',
              isActive
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
