'use client';

import { UserAvatar } from '@/components/core/user-avatar';
import Link from 'next/link';
import { UserGradeMark } from '../../trust/user-grade-mark';
import { Button } from '@/components/ui/button';
import type { MyProfileResponse } from '@/types/user';
import { gradeNameToLevel } from '@/lib/domain/grade-levels';

export function UserAuthButton({ me }: { me: MyProfileResponse | null }) {
  if (me) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <UserAvatar
            initial={me.nickname?.slice(0, 1) ?? '?'}
            imageUrl={me.picture || undefined}
            size="sm"
          />
          <span className="hidden sm:inline text-title-3 text-foreground truncate max-w-32">
            {me.nickname}
          </span>
          <UserGradeMark level={gradeNameToLevel(me.grade)} size="sm" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline" className="rounded-full">
        <Link href="/signin">로그인</Link>
      </Button>
    </div>
  );
}
