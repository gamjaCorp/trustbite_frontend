import { ChevronRight } from 'lucide-react';

import type { MyProfile } from '@/types/user';

interface Props {
  profile: MyProfile;
}

export function PointsAndListsRow({ profile }: Props) {
  const sharedListLabel = [
    ...profile.sharedListPreview,
    profile.sharedListExtraCount > 0 ? `+${profile.sharedListExtraCount}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        type="button"
        className="rounded-2xl bg-card shadow-card p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-caption-2 text-muted-foreground">포인트</span>
          <span className="inline-flex items-center gap-0.5 text-caption-2 text-muted-foreground">
            자세히
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
        <p className="text-foreground">
          <span className="text-headline-1 font-numeric">{profile.points}</span>
          <span className="text-sm text-muted-foreground ml-0.5">P</span>
        </p>
        <p className="text-caption-2 text-muted-foreground mt-1">
          최근 <span className="text-success font-semibold">+{profile.recentPointDelta}P</span>{' '}
          · {profile.recentPointReason}
        </p>
      </button>

      <button
        type="button"
        className="rounded-2xl bg-card shadow-card p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-caption-2 text-muted-foreground">함께 만든 리스트</span>
          <span className="inline-flex items-center gap-0.5 text-caption-2 text-muted-foreground">
            관리
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
        <p className="text-headline-1 font-numeric text-foreground">
          {profile.sharedListCount}
        </p>
        <p className="text-caption-2 text-muted-foreground mt-1 truncate">{sharedListLabel}</p>
      </button>
    </div>
  );
}
