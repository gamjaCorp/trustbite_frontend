import type { MyProfileResponse } from '@/types/user';
import { gradeNameToLevel } from '@/lib/domain/grade-levels';

import { AllGradesTimeline } from './all-grades-timeline';
import { CurrentGradePanel } from './current-grade-panel';
import { GradeTipBanner } from './grade-tip-banner';
import { NextStagePanel } from './next-stage-panel';

interface Props {
  profile: MyProfileResponse;
}

// 등급 가이드 카드 — 현재 등급·진행도·다음 단계 패널을 담는 셸
export function GradeGuideCard({ profile }: Props) {
  const level = gradeNameToLevel(profile.grade);
  const trustScore = Math.round(profile.trustScore * 100);

  return (
    <div>
      <div className="grid divide-y divide-border sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:divide-y-0 sm:divide-x">
        <CurrentGradePanel
          level={level}
          reviewCount={profile.reviewCount}
          trustScore={trustScore}
        />
        <NextStagePanel
          level={level}
          reviewCount={profile.reviewCount}
          trustScore={trustScore}
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
