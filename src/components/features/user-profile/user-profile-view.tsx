'use client';

import { useState } from 'react';

import { RegionalRankCard } from '@/components/features/ranking/regional-rank-card';
import { TasteProfileSection } from '@/components/features/my-restaurant/taste-profile-section';
import { getTrustToneClass } from '@/lib/trust-score';
import type { UserProfile } from '@/types/user';

import { FollowStatsRow } from './follow-stats-row';
import { LockedRankingsSection } from './locked-rankings-section';
import { UserProfileHeader } from './user-profile-header';

interface Props {
  profile: UserProfile;
}

export function UserProfileView({ profile }: Props) {
  const [isFollowing, setFollowing] = useState(false);
  const top3 = profile.rankings.slice(0, 3);
  const previewItem = profile.rankings[3];
  const trustTone = getTrustToneClass(profile.trustScore);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-6 pb-24">
      <UserProfileHeader
        profile={profile}
        isFollowing={isFollowing}
        onToggleFollow={() => setFollowing((v) => !v)}
      />
      <FollowStatsRow profile={profile} />

      <div className="mt-6 bg-card rounded-2xl shadow-card flex divide-x divide-border">
        <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
          <span className="text-headline-1 text-foreground">{profile.visitCount}</span>
          <span className="text-caption-2 text-muted-foreground">방문한 곳</span>
        </div>
        <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
          <span className="text-headline-1 text-foreground">{profile.reviewCount}</span>
          <span className="text-caption-2 text-muted-foreground">리뷰</span>
        </div>
        <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
          <span className={`text-headline-1 ${trustTone.text}`}>{profile.trustScore}</span>
          <span className="text-caption-2 text-muted-foreground">신뢰도</span>
        </div>
      </div>

      <div className="mt-5">
        <TasteProfileSection
          entries={profile.rankings}
          subjectName={profile.name}
          aiPersonaText={profile.aiTastePersona}
        />
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="text-title-1 text-foreground px-1">
          {profile.name}님의 인생 맛집 TOP 3
        </h2>
        <ul className="border-hairline border-y border-border/60">
          {top3.map((entry, i) => (
            <li key={entry.id} className={i > 0 ? 'border-hairline border-t border-border/60' : undefined}>
              <RegionalRankCard entry={{ ...entry, rank: i + 1 }} showVisitStats hideBookmark />
            </li>
          ))}
        </ul>
      </section>

      {isFollowing ? (
        <section className="mt-8 space-y-3">
          <h2 className="text-title-1 text-foreground px-1">
            전체 랭킹 {profile.totalRankCount}곳
          </h2>
          <ul className="border-hairline border-y border-border/60">
            {profile.rankings.map((entry, i) => (
              <li key={entry.id} className={i > 0 ? 'border-hairline border-t border-border/60' : undefined}>
                <RegionalRankCard entry={{ ...entry, rank: i + 1 }} showVisitStats hideBookmark />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <LockedRankingsSection
          previewItem={previewItem}
          totalCount={profile.totalRankCount}
          targetName={profile.name}
          onFollow={() => setFollowing(true)}
        />
      )}
    </div>
  );
}
