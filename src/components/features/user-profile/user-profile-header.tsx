import { MoreHorizontal, UserPlus, UserCheck } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/user';

interface Props {
  profile: UserProfile;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export function UserProfileHeader({ profile, isFollowing, onToggleFollow }: Props) {
  return (
    <div className="bg-card rounded-2xl shadow-card p-4 flex items-start gap-3">
      <Avatar className="h-11 w-11 shrink-0">
        <AvatarFallback className="bg-primary-subtle text-primary text-title-2">
          {profile.name[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-1.5">
          <h1 className="text-title-1 text-foreground truncate">
            {profile.name}님의 미식 가이드
          </h1>
          <span className="rounded-chip bg-primary/10 text-primary px-2 py-0.5 text-label-3">
            {profile.gradeName}
          </span>
        </div>
        <p className="mt-1 text-caption-2 text-muted-foreground truncate">
          @{profile.handle} · 검증된 맛집 {profile.curatedCount}곳
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="sm"
          onClick={onToggleFollow}
          className={cn(
            'gap-1.5 rounded-xl',
            isFollowing
              ? 'bg-card text-foreground border border-border hover:bg-muted'
              : 'bg-foreground text-background hover:bg-foreground/90',
          )}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              팔로잉 중
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              팔로우
            </>
          )}
        </Button>
        <button
          type="button"
          aria-label="더보기"
          className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
