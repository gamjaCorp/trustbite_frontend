'use client';

import { cn } from '@/lib/utils';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LoginCtaDialog } from '../../login-cta-dialog';
import Link from 'next/link';

const NAV_TABS = [
  { label: '맛집 탐색', href: '/', requiresAuth: false },
  { label: '나의 맛집', href: '/my-places', requiresAuth: true },
] as const;

export function NavTabs({ isAuthed }: { isAuthed: boolean }) {
  const pathname = usePathname();
  const [myPlacesDialogOpen, setMyPlacesDialogOpen] = useState(false);

  return (
    <>
      <nav className="max-w-5xl mx-auto w-full flex px-6">
        {NAV_TABS.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);

          if (tab.requiresAuth && !isAuthed) {
            return (
              <button
                key={tab.href}
                type="button"
                onClick={() => setMyPlacesDialogOpen(true)}
                className={cn(
                  'px-4 pb-2.5 pt-1 text-title-3 transition-colors text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'px-4 pb-2.5 pt-1 transition-colors',
                isActive
                  ? 'border-b-2 border-primary text-title-2 text-primary'
                  : 'text-body-2 text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <LoginCtaDialog
        open={myPlacesDialogOpen}
        onOpenChange={setMyPlacesDialogOpen}
        callbackPath="/my-places"
        description="로그인하면 나만의 맛집 지도를 만들 수 있어요"
      />
    </>
  );
}
