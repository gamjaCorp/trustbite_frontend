import { StatsStrip } from '@/components/common/display/stats-strip';
import { getTrustToneClass } from '@/lib/domain/trust-score';
import { nameTolocalGrade } from '@/lib/domain/grade-levels';
import type { UserProfile } from '@/types/user';

interface Props {
  profile: UserProfile;
}

// 등급 셀 값 — 아이콘 + 라벨. 로컬에 매핑되는 등급이 없으면 '-'만 표시
function GradeCellValue({ grade }: { grade: string }) {
  const levelDef = nameTolocalGrade(grade);
  if (!levelDef) return <>-</>;

  return (
    <span className={`flex items-center gap-1.5 ${levelDef.toneClass.text}`}>
      <levelDef.icon className="w-5 h-5" />
      {/* Fix: rank 필요 — 백엔드 rank 응답 도착 시 Lv.{rank} 추가 */}
      <span className="text-body-2 text-muted-foreground font-normal">{levelDef.label}</span>
    </span>
  );
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
