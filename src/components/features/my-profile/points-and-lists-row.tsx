import type { MyProfile } from '@/types/user';

import { Badge } from '@/components/ui/badge';

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

  const cardBase = 'px-8 py-6 text-left cursor-not-allowed';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-border">
      {/* TODO: 1차 MVP 제외 — 포인트 시스템 (3차 MVP) */}
      <div aria-disabled="true" className={cardBase}>
        <div className="flex items-center justify-between mb-4">
          <span className="opacity-35 text-label-2 text-muted-foreground">포인트</span>
          <Badge variant="secondary" className="text-caption-2">준비 중</Badge>
        </div>
        <div className="opacity-35">
          <p className="text-foreground">
            <span className="text-headline-1">{profile.points}</span>
            <span className="text-label-1 text-muted-foreground ml-0.5">P</span>
          </p>
          <p className="text-caption-2 text-muted-foreground mt-1">
            최근 <span className="font-semibold">+{profile.recentPointDelta}P</span>{' '}
            · {profile.recentPointReason}
          </p>
        </div>
      </div>

      {/* TODO: 1차 MVP 제외 — 함께 만든 리스트 (PRD 미정의) */}
      <div aria-disabled="true" className={`${cardBase} border-t sm:border-t-0 border-border`}>
        <div className="flex items-center justify-between mb-4">
          <span className="opacity-35 text-label-2 text-muted-foreground">함께 만든 리스트</span>
          <Badge variant="secondary" className="text-caption-2">준비 중</Badge>
        </div>
        <div className="opacity-35">
          <p className="text-headline-1 text-foreground">
            {profile.sharedListCount}
          </p>
          <p className="text-caption-2 text-muted-foreground mt-1 truncate">{sharedListLabel}</p>
        </div>
      </div>
    </div>
  );
}
