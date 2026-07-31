import type { RegionalRankEntry } from '@/types/restaurant';

import { LockedRankingsSection } from './locked-rankings-section';
import { UserRankingsSection } from './user-rankings-section';

interface Props {
  targetUserId: number;
  ownerName: string;
  rankings: RegionalRankEntry[];
  isFollowing: boolean;
}

// 랭킹 공개 게이트 — 팔로우 중이면 전체 랭킹, 아니면 인생 맛집 1곳 미리보기 + 잠금 CTA
export function UserRankingsGate({ targetUserId, ownerName, rankings, isFollowing }: Props) {
  const topPick = rankings[0];

  if (isFollowing) {
    return (
      <UserRankingsSection
        title={`전체 랭킹 ${rankings.length}곳`}
        ownerName={ownerName}
        entries={rankings}
      />
    );
  }

  return (
    <>
      {topPick && (
        <UserRankingsSection
          title={`${ownerName}님의 인생 맛집`}
          ownerName={ownerName}
          entries={[topPick]}
        />
      )}
      <LockedRankingsSection
        totalCount={rankings.length}
        targetName={ownerName}
        targetUserId={targetUserId}
      />
    </>
  );
}
