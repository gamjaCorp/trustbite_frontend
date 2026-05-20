import type { MyProfile } from '@/types/user';

import { GradeGuideCard } from '@/components/features/grade-guide/grade-guide-card';
import { PointsAndListsRow } from './points-and-lists-row';
import { ProfileFooter } from './profile-footer';
import { ProfileListRow } from './profile-list-row';
import { ProfileSection } from './profile-section';
import { ProfileSummaryCard } from './profile-summary-card';
import { ThemeSettingRow } from './theme-setting-row';

interface Props {
  profile: MyProfile;
}

export function MyProfileView({ profile }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-8 pt-8 pb-16 space-y-4">
      <ProfileSummaryCard profile={profile} />
      <section className="rounded-2xl bg-card border border-border overflow-hidden">
        <GradeGuideCard profile={profile} />
        <div className="border-t border-border">
          <PointsAndListsRow profile={profile} />
        </div>
        <div className="border-t border-border">
          <ProfileSection title="활동">
            <ProfileListRow label="내가 쓴 리뷰" value={`${profile.myReviewCount}개`} />
            <ProfileListRow
              label="잠금 해제한 미식 가이드"
              value={`${profile.unlockedGuideUserCount}명 · ${profile.unlockedGuideTier}차`}
            />
            <ProfileListRow label="도움됐어요 누른 리뷰" value={`${profile.helpfulVoteTier}차`} />
          </ProfileSection>
        </div>
        <div className="border-t border-border">
          <ProfileSection title="설정">
            <ThemeSettingRow />
            <ProfileListRow label="활동 지역" value={profile.activityRegion} />
            <ProfileListRow label="알림 설정" />
            <ProfileListRow label="계정 관리" />
            <ProfileListRow label="로그아웃" tone="danger" />
          </ProfileSection>
        </div>
      </section>
      <ProfileFooter />
    </div>
  );
}
