import { ChevronRight } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { UserProfile } from '@/types/user';

interface Props {
  profile: UserProfile;
}

export function FollowStatsRow({ profile }: Props) {
  return (
    <div className="mt-3 flex items-center justify-between gap-2 px-1">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <span className="font-semibold text-foreground">{profile.followerCount}</span>
          <span>팔로워</span>
          <ChevronRight className="w-3 h-3" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <span className="font-semibold text-foreground">{profile.followingCount}</span>
          <span>팔로잉</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {profile.mutualFollowing && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-2.5 py-1">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="bg-primary-subtle text-primary text-label-3">
              {profile.mutualFollowing.displayName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-caption-2 text-muted-foreground">
            <span className="font-semibold text-foreground">{profile.mutualFollowing.displayName}</span>
            {' 외 내 팔로잉 '}
            <span className="font-semibold text-foreground">{profile.mutualFollowing.extraCount}</span>
            명도 팔로우 중
          </span>
        </div>
      )}
    </div>
  );
}
