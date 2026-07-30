import type { MyProfileResponse } from '@/types/user';
import type { Grade } from '@/types/grade';
import { mergeGradeLadder } from '@/lib/domain/grade-levels';

import { AllGradesTimeline } from './all-grades-timeline';
import { CurrentGradePanel } from './current-grade-panel';
import { GradeTipBanner } from './grade-tip-banner';
import { NextStagePanel } from './next-stage-panel';

interface Props {
  profile: MyProfileResponse;
  grades: Grade[];
}

// 등급 가이드 카드 — 현재 등급·진행도·다음 단계 패널을 담는 셸
export function GradeGuideCard({ profile, grades }: Props) {
  const mergedGrades = mergeGradeLadder(grades);
  const myGradeData = mergedGrades.find((grade) => grade.name === profile.grade);
  const trustScore = Math.round(profile.trustScore * 100);

  console.log(profile);
  console.log(grades);

  if (!myGradeData) {
    return (
      <div className="px-8 py-10 text-center text-body-2 text-muted-foreground">
        등급 정보를 불러올 수 없어요
      </div>
    );
  }

  return (
    <div>
      <div className="grid divide-y divide-border sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:divide-y-0 sm:divide-x">
        <CurrentGradePanel
          myGradeData={myGradeData}
          reviewCount={profile.reviewCount}
          trustScore={trustScore}
        />
        <NextStagePanel
          myGradeData={myGradeData}
          mergedGrades={mergedGrades}
          reviewCount={profile.reviewCount}
          trustScore={trustScore}
        />
      </div>
      <div className="border-t border-border">
        <GradeTipBanner />
      </div>
      <div className="border-t border-border">
        <AllGradesTimeline currentLevel={myGradeData.rank} grades={grades} />
      </div>
    </div>
  );
}
