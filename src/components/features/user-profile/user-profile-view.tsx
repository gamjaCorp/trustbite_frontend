'use client';

import { RegionalRankCard } from '@/components/features/ranking/regional-rank-card';
import { TasteProfileSection } from '@/components/features/my-restaurant/taste-profile-section';
import { StatsStrip } from '@/components/common/stats-strip';
import { getLevelDef } from '@/lib/grade-levels';
import { getTrustToneClass } from '@/lib/trust-score';
import { useFollowMock } from '@/stores/follow-mock-store';
import type { UserProfile } from '@/types/user';

import { LockedRankingsSection } from './locked-rankings-section';
import { UserProfileHeader } from './user-profile-header';

interface Props {
  profile: UserProfile;
}

export function UserProfileView({ profile }: Props) {
  const isFollowing = useFollowMock((s) => s.isFollowing(profile.id));
  const toggle = useFollowMock((s) => s.toggle);
  const topPick = profile.rankings[0];
  const trustTone = getTrustToneClass(profile.trustScore);
  const levelDef = getLevelDef(profile.level);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-6 pb-24">
      <UserProfileHeader
        profile={profile}
        isFollowing={isFollowing}
        onToggleFollow={() => toggle(profile.id)}
      />

      <div className="mt-6">
        <StatsStrip
          items={[
            { label: '리뷰', value: `${profile.reviewCount}개` },
            {
              label: '신뢰도',
              value: `${profile.trustScore}%`,
              valueClassName: trustTone.text,
            },
            {
              label: '등급',
              value: (
                <span className={`flex items-center gap-1.5 ${levelDef.toneClass.text}`}>
                  <levelDef.icon className="w-5 h-5" />
                  Lv.{profile.level}
                  <span className="text-body-2 text-muted-foreground font-normal">
                    {levelDef.label}
                  </span>
                </span>
              ),
            },
          ]}
        />
      </div>

      <div className="mt-5">
        <TasteProfileSection
          entries={profile.rankings}
          subjectName={profile.name}
          aiPersonaText={profile.aiTastePersona}
        />
      </div>

      {topPick && !isFollowing && (
        <section className="mt-8 space-y-3">
          <h2 className="text-title-1 text-foreground px-1">
            {profile.name}님의 인생 맛집
          </h2>
          <ul className="border-y border-border">
            <li>
              <RegionalRankCard entry={{ ...topPick, rank: 1 }} showVisitStats hideBookmark />
            </li>
          </ul>
        </section>
      )}

      {isFollowing ? (
        <section className="mt-8 space-y-3">
          <h2 className="text-title-1 text-foreground px-1">
            전체 랭킹 {profile.totalRankCount}곳
          </h2>
          <ul className="border-y border-border">
            {profile.rankings.map((entry, i) => (
              <li key={entry.id} className={i > 0 ? 'border-t border-border' : undefined}>
                <RegionalRankCard entry={{ ...entry, rank: i + 1 }} showVisitStats hideBookmark />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <LockedRankingsSection
          totalCount={profile.totalRankCount}
          targetName={profile.name}
          onFollow={() => toggle(profile.id)}
        />
      )}
    </div>
  );
}
