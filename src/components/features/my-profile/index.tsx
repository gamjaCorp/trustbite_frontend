import type { MyProfile } from '@/lib/types/user';

import { Surface } from '@/components/common/display/surface';
import { GradeGuideCard } from './grade-guide/index';
import { PointsAndListsRow } from './rows/points-and-lists-row';
import { ProfileFooter } from './profile-footer';
import { ProfileListRow } from './rows/profile-list-row';
import { ProfileSection } from './profile-section';
import { ProfileSummaryCard } from './profile-summary-card';
import { ThemeSettingRow } from './rows/theme-setting-row';
import { LogoutRow } from './rows/logout-row';

interface Props {
  profile: MyProfile;
}

// 내 프로필 뷰 — 등급 가이드·설정 목록·로그아웃을 세로로 배치
export function MyProfileView({ profile }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-8 pt-8 pb-16 space-y-4">
      <ProfileSummaryCard profile={profile} />
      <Surface as="section" variant="bordered" padding="none" className="overflow-hidden">
        <GradeGuideCard profile={profile} />
        <div className="border-t border-border">
          <PointsAndListsRow profile={profile} />
        </div>
        {/* TODO: 1차 MVP 제외 — 활동 섹션 전체 (내 리뷰 목록·잠금 해제·도움됐어요 2·3차 MVP) */}
        <div className="border-t border-border">
          <ProfileSection title="활동">
            <ProfileListRow label="내가 쓴 리뷰" value={`${profile.myReviewCount}개`} disabled />
            <ProfileListRow
              label="잠금 해제한 미식 가이드"
              value={`${profile.unlockedGuideUserCount}명 · ${profile.unlockedGuideTier}차`}
              disabled
            />
            <ProfileListRow label="도움됐어요 누른 리뷰" value={`${profile.helpfulVoteTier}차`} disabled />
          </ProfileSection>
        </div>
        <div className="border-t border-border">
          <ProfileSection title="설정">
            <ThemeSettingRow />
            {/* TODO: 1차 MVP 제외 — 설정 하위 항목 (PRD 미정의) */}
            <ProfileListRow label="활동 지역" value={profile.activityRegion} disabled />
            <ProfileListRow label="알림 설정" disabled />
            <ProfileListRow label="계정 관리" disabled />
            <LogoutRow />
          </ProfileSection>
        </div>
      </Surface>
      <ProfileFooter />
    </div>
  );
}
