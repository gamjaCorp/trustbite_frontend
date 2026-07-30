'use client';

import {
  PlaceListRow,
  toPlaceListRowData,
} from '@/components/common/restaurant/place-list-row/index';
import { TasteProfileSection } from '@/components/common/profile/taste-profile-section';
import { StatsStrip } from '@/components/common/display/stats-strip';
import { SectionHeader } from '@/components/common/display/section-header';
import { DividedList } from '@/components/common/display/divided-list';
import { getTrustToneClass } from '@/lib/domain/trust-score';
import { useFollowMock } from '@/components/features/follow/stores/follow-mock-store';
import type { UserProfile } from '@/types/user';
import type { RegionalRankEntry } from '@/types/restaurant';

import { LockedRankingsSection } from './locked-rankings-section';
import { UserProfileHeader } from './user-profile-header';
import { nameTolocalGrade } from '@/lib/domain/grade-levels';

interface Props {
  profile: UserProfile;
}

// 다른 유저 프로필 뷰 — 헤더·미각 레이더·랭킹 리스트 표시
export function UserProfileView({ profile }: Props) {
  const toggle = useFollowMock((s) => s.toggle);
  // Fix: 팔로우 여부 필요 — GET /api/users/{userId} 응답에 following 필드 없음(대기 표 ⓑ), 임시 고정값
  const isFollowing = false;
  // Fix: 리뷰·랭킹 데이터 필요 — GET /api/ratings/user/{userId} 연동 전까지 임시 빈 배열
  const rankings: RegionalRankEntry[] = [];
  const topPick = rankings[0];
  const trustTone = getTrustToneClass(profile.trustScore);

  // Fix: rank 필요
  const levelDef = nameTolocalGrade(profile.grade);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-6 pb-24">
      <UserProfileHeader
        profile={profile}
        isFollowing={isFollowing}
        onToggleFollow={() => toggle(String(profile.userId))}
      />

      <div className="mt-6">
        <StatsStrip
          items={[
            { label: '리뷰', value: `${profile.reviewCount}개` },
            {
              label: '신뢰도',
              value: `${profile.trustScore ?? 0}%`,
              valueClassName: trustTone.text,
            },
            {
              label: '등급',
              value: levelDef ? (
                <span className={`flex items-center gap-1.5 ${levelDef.toneClass.text}`}>
                  <levelDef.icon className="w-5 h-5" />
                  {/* Fix */}
                  {/* Lv.{profile.level} */}
                  <span className="text-body-2 text-muted-foreground font-normal">
                    {levelDef.label}
                  </span>
                </span>
              ) : (
                <></>
              ),
            },
          ]}
        />
      </div>

      <div className="mt-5">
        {/* Fix: AI 취향 요약 필요 — 백엔드 미제공, 임시로 기본 문구 사용(prop 생략) */}
        <TasteProfileSection entries={rankings} subjectName={profile.nickname} />
      </div>

      {topPick && !isFollowing && (
        <section className="mt-8 space-y-3">
          <SectionHeader title={`${profile.nickname}님의 인생 맛집`} className="px-1" />
          <DividedList
            items={[topPick]}
            keyFn={(e) => e.id}
            listClassName="border-y border-border"
            renderItem={(entry) => (
              <PlaceListRow
                variant="my"
                ownerName={profile.nickname}
                data={toPlaceListRowData({ ...entry, rank: 1 })}
              />
            )}
          />
        </section>
      )}

      {isFollowing ? (
        <section className="mt-8 space-y-3">
          <SectionHeader title={`전체 랭킹 ${rankings.length}곳`} className="px-1" />
          <DividedList
            items={rankings}
            keyFn={(e) => e.id}
            listClassName="border-y border-border"
            renderItem={(entry, i) => (
              <PlaceListRow
                variant="my"
                ownerName={profile.nickname}
                data={toPlaceListRowData({ ...entry, rank: i + 1 })}
              />
            )}
          />
        </section>
      ) : (
        <LockedRankingsSection
          totalCount={rankings.length}
          targetName={profile.nickname}
          onFollow={() => toggle(String(profile.userId))}
        />
      )}
    </div>
  );
}
