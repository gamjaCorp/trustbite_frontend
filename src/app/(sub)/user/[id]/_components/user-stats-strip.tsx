import { StatsStrip } from '@/components/common/display/stats-strip';
import { GradeCellValue } from '@/components/common/trust/grade-cell-value';
import { getTrustToneClass } from '@/lib/domain/trust-score';
import type { UserProfile } from '@/types/user';

interface Props {
  profile: UserProfile;
}

// 타 유저 프로필 통계 스트립 — 리뷰/신뢰도/등급을 StatsStrip 3칸으로 표시
export function UserStatsStrip({ profile }: Props) {
  const trustTone = getTrustToneClass(profile.trustScore);

  return (
    <StatsStrip
      items={[
        { label: '리뷰', value: `${profile.reviewCount}개` },
        {
          label: '신뢰도',
          value: `${profile.trustScore ?? 0}%`,
          valueClassName: trustTone.text,
        },
        { label: '등급', value: <GradeCellValue grade={profile.grade} /> },
      ]}
    />
  );
}
