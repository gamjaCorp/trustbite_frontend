'use client';

import { PlaceListRow, toPlaceListRowData } from '@/components/common/restaurant/place-list-row/index';
import { TasteProfileSection } from '@/components/common/profile/taste-profile-section';
import { StatsStrip } from '@/components/common/display/stats-strip';
import { SectionHeader } from '@/components/common/display/section-header';
import { DividedList } from '@/components/common/display/divided-list';
import { Bookmark } from 'lucide-react';
import { getTrustToneClass } from '@/lib/domain/trust-score';
import { useFollowMock } from '@/components/features/follow/stores/follow-mock-store';
import type { UserProfile } from '@/types/user';

import { LockedRankingsSection } from './locked-rankings-section';
import { UserProfileHeader } from './user-profile-header';

interface Props {
  profile: UserProfile;
}

// 다른 유저 프로필 뷰 — 헤더·미각 레이더·랭킹 리스트 표시
export function UserProfileView({ profile }: Props) {
  const isFollowing = useFollowMock((s) => s.isFollowing(profile.id));
  const toggle = useFollowMock((s) => s.toggle);
  const topPick = profile.rankings[0];
  const trustTone = getTrustToneClass(profile.trustScore);
  // Fix: 레벨 필요 — 백엔드 rank 응답 필요, getLevelDef 제거로 임시 mock 고정값 사용
  const levelDef = { label: '맛집 수집가', icon: Bookmark, toneClass: { text: 'text-palette-blue' } };

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
