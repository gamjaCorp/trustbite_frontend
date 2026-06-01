'use client';

import { PlaceListRow, toPlaceListRowData } from '@/components/common/place-list-row';
import { TasteProfileSection } from '@/components/common/taste-profile-section';
import { StatsStrip } from '@/components/common/stats-strip';
import { SectionHeader } from '@/components/common/section-header';
import { DividedList } from '@/components/common/divided-list';
import { getLevelDef } from '@/lib/grade-levels';
import { getTrustToneClass } from '@/lib/trust-score';
import { useFollowMock } from '@/stores/follow-mock-store';
import type { UserProfile } from '@/lib/types/user/type';

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
          <SectionHeader title={`${profile.name}님의 인생 맛집`} className="px-1" />
          <DividedList
            items={[topPick]}
            keyFn={(e) => e.id}
            listClassName="border-y border-border"
            renderItem={(entry) => (
              <PlaceListRow variant="my" ownerName={profile.name} data={toPlaceListRowData({ ...entry, rank: 1 })} />
            )}
          />
        </section>
      )}

      {isFollowing ? (
        <section className="mt-8 space-y-3">
          <SectionHeader title={`전체 랭킹 ${profile.totalRankCount}곳`} className="px-1" />
          <DividedList
            items={profile.rankings}
            keyFn={(e) => e.id}
            listClassName="border-y border-border"
            renderItem={(entry, i) => (
              <PlaceListRow variant="my" ownerName={profile.name} data={toPlaceListRowData({ ...entry, rank: i + 1 })} />
            )}
          />
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
