// 다른 유저 프로필 뷰 — 헤더·미각 레이더·랭킹 리스트 표시 (server component)
import { TasteProfileSection } from '@/components/common/profile/taste-profile-section';
import type { UserProfile } from '@/types/user';
import type { RegionalRankEntry } from '@/types/restaurant';

import { UserProfileHeader } from './user-profile-header';
import { UserStatsStrip } from './user-stats-strip';
import { UserRankingsGate } from './user-rankings-gate';

interface Props {
  profile: UserProfile;
}

// 다른 유저 프로필 뷰 — 헤더·미각 레이더·랭킹 리스트 표시
export function UserProfileView({ profile }: Props) {
  // Fix: 리뷰·랭킹 데이터 필요 — GET /api/ratings/user/{userId} 연동 전까지 임시 빈 배열
  const rankings: RegionalRankEntry[] = [];
  // Fix: isFollowing 데이타 필요
  const isFollowing = false;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-6 pb-24">
      <UserProfileHeader profile={profile} />

      <div className="mt-6">
        <UserStatsStrip profile={profile} />
      </div>

      <div className="mt-5">
        {/* Fix: AI 취향 요약 필요 — 백엔드 미제공, 임시로 기본 문구 사용(prop 생략) */}
        <TasteProfileSection entries={rankings} subjectName={profile.nickname} />
      </div>

      <UserRankingsGate
        targetUserId={profile.userId}
        ownerName={profile.nickname}
        rankings={rankings}
        isFollowing={isFollowing}
      />
    </div>
  );
}
