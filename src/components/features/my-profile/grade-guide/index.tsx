import type { MyProfile } from '@/types/user';

import { AllGradesTimeline } from './all-grades-timeline';
import { CurrentGradePanel } from './current-grade-panel';
import { GradeTipBanner } from './grade-tip-banner';
import { NextStagePanel } from './next-stage-panel';

interface Props {
  profile: MyProfile;
}

export function GradeGuideCard({ profile }: Props) {
  const level = profile.level;

  return (
    <div>
      <div className="grid divide-y divide-border sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:divide-y-0 sm:divide-x">
        <CurrentGradePanel
          level={level}
          reviewCount={profile.reviewCount}
          trustScore={profile.trustScore}
        />
        <NextStagePanel
          level={level}
          reviewCount={profile.reviewCount}
          trustScore={profile.trustScore}
        />
      </div>
      <div className="border-t border-border">
        <GradeTipBanner />
      </div>
      <div className="border-t border-border">
        <AllGradesTimeline currentLevel={level} />
      </div>
    </div>
  );
}
